"""
llm.py
All language-model calls live here. Gemini is used ONLY for things that
genuinely need language reasoning:
  - structuring raw scraped JD text into title/company/skills/responsibilities/qualifications
  - writing strengths & weaknesses narrative
  - improving resume bullets
  - generating interview questions
  - company-specific feedback (grounded in computed fit scores)
  - section-specific resume rewrite (experience / skills / projects)

It is NOT used to invent the ATS score or skill-match numbers — those
come from matcher.py / ats.py.

FALLBACK: if Gemini is unreachable, out of quota, or GOOGLE_API_KEY is
missing, every call automatically retries against a local Ollama server
(http://localhost:11434) using the fastest small model available on the
machine, so the app keeps working fully offline. The engine actually used
("gemini" | "ollama") is returned alongside every response so the UI can
show a small badge.
"""

import os
import json
import re
import logging
import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("resumeiq.llm")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "").strip()
GEMINI_MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-flash-latest")

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
# Preference order — first one that's actually pulled locally wins.
# Small/fast models first so the fallback stays snappy.
OLLAMA_MODEL_PREFERENCE = [
    m.strip() for m in os.getenv(
        "OLLAMA_MODEL_PREFERENCE",
        "llama3.2:1b,llama3.2,phi3.5,gemma2:2b,qwen2.5:3b,mistral"
    ).split(",") if m.strip()
]

_genai = None
if GOOGLE_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GOOGLE_API_KEY)
        _genai = genai
    except Exception:
        _genai = None

_ollama_model_cache = {"model": None, "checked": False}


# ── Engine plumbing ─────────────────────────────────────────────────────────

def _get_gemini_model():
    if not _genai:
        return None
    return _genai.GenerativeModel(GEMINI_MODEL_NAME)


def _pick_ollama_model() -> str:
    """Ask the local Ollama daemon which models are installed and pick the
    fastest one available from our preference list."""
    if _ollama_model_cache["checked"]:
        return _ollama_model_cache["model"]
    _ollama_model_cache["checked"] = True
    try:
        r = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        r.raise_for_status()
        installed = [m["name"] for m in r.json().get("models", [])]
        for pref in OLLAMA_MODEL_PREFERENCE:
            for name in installed:
                if name == pref or name.startswith(pref):
                    _ollama_model_cache["model"] = name
                    return name
        if installed:
            _ollama_model_cache["model"] = installed[0]
            return installed[0]
    except Exception:
        pass
    return None


def ollama_status() -> dict:
    """Used by /api/llm/status so the frontend can show a live indicator."""
    model = _pick_ollama_model()
    return {
        "gemini_configured": bool(GOOGLE_API_KEY and _genai),
        "gemini_model": GEMINI_MODEL_NAME,
        "ollama_reachable": model is not None,
        "ollama_model": model,
    }


def _call_ollama(prompt: str) -> str:
    model = _pick_ollama_model()
    if not model:
        raise RuntimeError(
            "Ollama is not reachable on this machine (expected at "
            f"{OLLAMA_BASE_URL}). Install Ollama and run "
            "`ollama pull llama3.2:1b` for the fastest local fallback."
        )
    resp = requests.post(
        f"{OLLAMA_BASE_URL}/api/generate",
        json={"model": model, "prompt": prompt, "stream": False,
              "options": {"temperature": 0.4}},
        timeout=120,
    )
    resp.raise_for_status()
    return resp.json().get("response", "").strip()


def _generate(prompt: str) -> dict:
    """Try Gemini first; transparently fall back to local Ollama.
    Returns {"text": str, "engine": "gemini"|"ollama"}.
    """
    gemini_error = None
    if _genai:
        try:
            model = _get_gemini_model()
            response = model.generate_content(prompt)
            text = (response.text or "").strip()
            if text:
                return {"text": text, "engine": "gemini"}
            gemini_error = "Gemini returned an empty response"
        except Exception as e:
            logger.warning("Gemini call failed, falling back to Ollama: %r", e)
            gemini_error = str(e)
    else:
        gemini_error = "Gemini is not configured (missing/invalid GOOGLE_API_KEY)"

    try:
        text = _call_ollama(prompt)
        return {"text": text, "engine": "ollama"}
    except Exception as ollama_error:
        # Neither engine worked — surface a clear error instead of a raw 500.
        raise RuntimeError(
            f"No LLM engine available. Gemini error: {gemini_error}. "
            f"Ollama error: {ollama_error}"
        )


def _safe_json_parse(raw: str):
    """Strip markdown code fences if present and parse JSON."""
    cleaned = re.sub(r"^```json\s*|^```\s*|```$", "", raw.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                return None
        return None


def structure_job_description(raw_jd_text: str) -> dict:
    prompt = f"""You are extracting structured fields from a job posting.
Return ONLY valid JSON, no markdown, no commentary, with exactly these keys:
{{
  "job_title": string,
  "company": string,
  "skills": [list of specific technical skills/tools mentioned],
  "responsibilities": [list of short bullet strings],
  "qualifications": [list of short bullet strings]
}}

Job posting text:
\"\"\"{raw_jd_text[:8000]}\"\"\"
"""
    result = _generate(prompt)
    parsed = _safe_json_parse(result["text"])
    if parsed is None:
        return {
            "job_title": "Unknown", "company": "Unknown", "skills": [],
            "responsibilities": [], "qualifications": [],
            "_raw_error": result["text"], "_engine": result["engine"],
        }
    parsed["_engine"] = result["engine"]
    return parsed


def generate_strengths_weaknesses(resume_text: str, jd_text: str, ats_result: dict) -> dict:
    prompt = f"""You are a technical recruiter. Based on the resume and job
description below, AND the computed match data, list:
- 3-5 concise strengths (each under 12 words)
- 3-5 concise weaknesses/gaps (each under 12 words)

Return ONLY valid JSON: {{"strengths": [...], "weaknesses": [...]}}

Computed matched skills: {ats_result['keyword_gap']['matched']}
Computed missing skills: {ats_result['keyword_gap']['missing']}

Resume:
\"\"\"{resume_text[:6000]}\"\"\"

Job Description:
\"\"\"{jd_text[:4000]}\"\"\"
"""
    result = _generate(prompt)
    parsed = _safe_json_parse(result["text"])
    if parsed is None:
        return {"strengths": [], "weaknesses": [], "_raw_error": result["text"], "_engine": result["engine"]}
    parsed["_engine"] = result["engine"]
    return parsed


def improve_bullet(bullet_text: str, jd_text: str) -> dict:
    prompt = f"""Rewrite this single resume bullet point to be more impactful:
use a strong action verb, add quantifiable impact if plausible, and align
language with the target job description where honest to do so. Do NOT
invent numbers/metrics that aren't implied by the original bullet — if no
metric is implied, improve the verb/clarity instead. Return ONLY the
rewritten bullet text, nothing else.

Original bullet: "{bullet_text}"

Target job description (for tone/keyword alignment only):
\"\"\"{jd_text[:2000]}\"\"\"
"""
    result = _generate(prompt)
    return {"text": result["text"].strip().strip('"'), "engine": result["engine"]}


def generate_company_specific_feedback(resume_text: str, jd_text: str,
                                       ats_result: dict, company_profile: dict,
                                       company_fit: dict) -> dict:
    prompt = f"""You are a recruiter who specializes in hiring for {company_profile['name'].title()}.
Given the resume, job description, and computed match data below, write a short
(120-180 word) piece of feedback tailored to how {company_profile['name'].title()}
specifically evaluates candidates. Reference their actual priority skills and
culture/interview style where relevant. Be direct and specific, not generic.

{company_profile['name'].title()}'s known priority skills: {company_profile['priority_skills']}
{company_profile['name'].title()}'s culture/interview notes: {company_profile['culture_notes']}
{company_profile['name'].title()}'s leveling notes: {company_profile['leveling_hint']}

Candidate has these company priority skills: {company_fit['matched_priority']}
Candidate is missing these company priority skills: {company_fit['missing_priority']}
Company fit score (priority skills only): {company_fit['fit_score']}%

Computed matched skills: {ats_result['keyword_gap']['matched']}
Computed missing skills: {ats_result['keyword_gap']['missing']}
Overall computed ATS score: {ats_result['overall']}%

Resume:
\"\"\"{resume_text[:5000]}\"\"\"

Job Description:
\"\"\"{jd_text[:3000]}\"\"\"
"""
    result = _generate(prompt)
    return {"text": result["text"].strip(), "engine": result["engine"]}


def suggest_similar_jobs(jd_structured: dict) -> dict:
    prompt = f"""Given this job posting, suggest 5 comparable roles at OTHER
companies that a candidate could also apply to. Return ONLY valid JSON:
{{"similar_roles": [{{"company": string, "role_title": string, "why_similar": string}}]}}

Job Title: {jd_structured.get('job_title')}
Company: {jd_structured.get('company')}
Skills: {jd_structured.get('skills')}
Responsibilities: {jd_structured.get('responsibilities')}
"""
    result = _generate(prompt)
    parsed = _safe_json_parse(result["text"])
    if parsed is None:
        return {"similar_roles": [], "_raw_error": result["text"], "_engine": result["engine"]}
    parsed["_engine"] = result["engine"]
    return parsed


def rewrite_resume_section(resume_text: str, jd_text: str,
                            section_name: str, section_content: str,
                            missing_skills: list) -> dict:
    section_display = section_name.title()
    prompt = f"""Rewrite only the '{section_display}' section of this resume to
be more impactful and better aligned with the target job description.

Rules:
- Do NOT invent companies, titles, dates, metrics, or skills not already mentioned.
- Improve verbs, clarity, structure, and foreground JD-relevant content.
- For Skills section: reorganize to surface the most JD-relevant skills first.
- For Experience/Projects: tighten bullet points using strong action verbs.
- At the end, add one short paragraph labeled "Suggested Additions (verify before using):"
  mentioning any missing skills from the list below that the candidate should add
  if they genuinely have that experience. Do NOT add them into the main section body.
- Return only the rewritten section in clean Markdown, starting with ## {section_display}.

Missing skills to note as suggestions: {missing_skills}

Current '{section_display}' section:
\"\"\"{section_content[:4000]}\"\"\"

Target job description (for alignment):
\"\"\"{jd_text[:2500]}\"\"\"

Full resume context (read-only, for coherence):
\"\"\"{resume_text[:4000]}\"\"\"
"""
    result = _generate(prompt)
    return {"text": result["text"].strip(), "engine": result["engine"]}


def rewrite_resume(resume_text: str, jd_text: str, missing_skills: list) -> dict:
    prompt = f"""Rewrite the following resume to be more impactful and better
aligned with the target job description. Rules:
- Do NOT invent companies, titles, dates, metrics, or skills the person
  doesn't already mention.
- You MAY improve verbs, clarity, and structure, and reorder bullets to
  foreground JD-relevant experience.
- For each skill in the "missing skills" list below, add one line at the
  end under "## Suggested Additions (verify before using)" noting that the
  candidate should add a project/line item if they genuinely have that
  experience — do NOT add it directly into the resume body.
- Return the rewritten resume in clean Markdown.

Missing skills (JD wants these, not currently evidenced in resume): {missing_skills}

Original resume:
\"\"\"{resume_text[:7000]}\"\"\"

Target job description:
\"\"\"{jd_text[:3000]}\"\"\"
"""
    result = _generate(prompt)
    return {"text": result["text"].strip(), "engine": result["engine"]}


def generate_interview_questions(resume_text: str, jd_text: str) -> dict:
    prompt = f"""Based on this resume and job description, generate interview
questions a candidate should prepare for. Return ONLY valid JSON:
{{"hr_questions": [...], "technical_questions": [...], "project_questions": [...]}}
3-5 questions per category.

Resume:
\"\"\"{resume_text[:6000]}\"\"\"

Job Description:
\"\"\"{jd_text[:4000]}\"\"\"
"""
    result = _generate(prompt)
    parsed = _safe_json_parse(result["text"])
    if parsed is None:
        return {"hr_questions": [], "technical_questions": [], "project_questions": [],
                "_raw_error": result["text"], "_engine": result["engine"]}
    parsed["_engine"] = result["engine"]
    return parsed
