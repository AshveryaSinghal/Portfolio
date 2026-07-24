"""
main.py — ResumeIQ API
FastAPI backend exposing every capability of the original Streamlit app
as clean REST endpoints for the React frontend. All scoring/matching
logic is untouched (ats.py / matcher.py) — only the delivery layer changed.
"""

import io
import json
from typing import Optional, List

from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from modules import (
    jd_extractor, resume_parser, matcher, ats, llm,
    storage, auth, company_profiles, roadmap, report,
)

storage.init_db()

app = FastAPI(title="ResumeIQ API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Auth dependency ──────────────────────────────────────────────────────────

def get_current_user(authorization: Optional[str] = Header(None)):
    """Returns the user dict if a valid bearer token is provided, else None
    (guest mode — analysis still works, just nothing is persisted)."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1].strip()
    return storage.get_user_by_token(token)


# ── Schemas ──────────────────────────────────────────────────────────────────

class SignupBody(BaseModel):
    username: str
    password: str


class LoginBody(BaseModel):
    username: str
    password: str


class JDUrlBody(BaseModel):
    url: str


class JDStructureBody(BaseModel):
    raw_text: str


class AnalysisBody(BaseModel):
    resume_text: str
    jd_text: str
    sections: dict
    candidate_months_experience: int = 0
    jd_structured_skills: Optional[List[str]] = None


class StrengthsBody(BaseModel):
    resume_text: str
    jd_text: str
    ats_result: dict


class ImproveBulletBody(BaseModel):
    bullet_text: str
    jd_text: str


class CompanyFitBody(BaseModel):
    resume_text: str
    company_name: str


class CompanyFeedbackBody(BaseModel):
    resume_text: str
    jd_text: str
    ats_result: dict
    company_name: str


class RoadmapBody(BaseModel):
    missing_skills: List[str] = []
    company_missing_priority: Optional[List[str]] = None
    total_weeks: int = 8


class InterviewBody(BaseModel):
    resume_text: str
    jd_text: str


class RewriteSectionBody(BaseModel):
    resume_text: str
    jd_text: str
    section_name: str
    section_content: str
    missing_skills: List[str] = []


class SimilarRolesBody(BaseModel):
    jd_structured: dict


class ReportBody(BaseModel):
    jd_info: dict
    ats_result: dict
    strengths_weaknesses: Optional[dict] = None
    roadmap: Optional[list] = None


class SaveResumeVersionBody(BaseModel):
    label: str
    resume_text: str
    filename: Optional[str] = None


class SaveAnalysisBody(BaseModel):
    resume_version_id: Optional[int] = None
    jd_label: str
    jd_text: str
    overall_score: float
    breakdown: dict
    gap: dict


class CompareResumesBody(BaseModel):
    resume_versions: List[dict]  # [{label, resume_text, sections, months}]
    jd_text: str
    jd_structured_skills: Optional[List[str]] = None


class CompareJDsBody(BaseModel):
    resume_text: str
    sections: dict
    months: int
    jd_versions: List[dict]  # [{label, jd_text}]


# ── Health / LLM status ──────────────────────────────────────────────────────

@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/llm/status")
def llm_status():
    return llm.ollama_status()


# ── Auth ─────────────────────────────────────────────────────────────────────

@app.post("/api/auth/signup")
def signup(body: SignupBody):
    result = auth.signup(body.username, body.password)
    if not result["success"]:
        raise HTTPException(400, result["error"])
    token = storage.create_session(result["user"]["id"])
    return {"token": token, "user": {"id": result["user"]["id"], "username": result["user"]["username"]}}


@app.post("/api/auth/login")
def login(body: LoginBody):
    result = auth.login(body.username, body.password)
    if not result["success"]:
        raise HTTPException(401, result["error"])
    token = storage.create_session(result["user"]["id"])
    return {"token": token, "user": {"id": result["user"]["id"], "username": result["user"]["username"]}}


@app.post("/api/auth/logout")
def logout(authorization: Optional[str] = Header(None)):
    if authorization and authorization.startswith("Bearer "):
        storage.delete_session(authorization.split(" ", 1)[1].strip())
    return {"success": True}


@app.get("/api/auth/me")
def me(user=Depends(get_current_user)):
    if not user:
        return {"user": None}
    return {"user": {"id": user["id"], "username": user["username"]}}


# ── Companies ────────────────────────────────────────────────────────────────

@app.get("/api/companies")
def list_companies():
    return {"companies": company_profiles.list_supported_companies()}


# ── Job description ──────────────────────────────────────────────────────────

@app.post("/api/jd/from-url")
def jd_from_url(body: JDUrlBody):
    try:
        text = jd_extractor.fetch_jd_text_from_url(body.url)
        return {"raw_text": text}
    except jd_extractor.JDFetchError as e:
        raise HTTPException(422, str(e))


@app.post("/api/jd/structure")
def jd_structure(body: JDStructureBody):
    try:
        return llm.structure_job_description(body.raw_text)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))


# ── Resume parsing ───────────────────────────────────────────────────────────

@app.post("/api/resume/parse")
async def resume_parse(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Please upload a PDF resume.")
    raw_bytes = await file.read()
    file_like = io.BytesIO(raw_bytes)
    try:
        full_text = resume_parser.extract_text(file_like)
    except Exception as e:
        raise HTTPException(422, f"Could not read this PDF: {e}")
    if not full_text.strip():
        raise HTTPException(422, "Could not extract text from this PDF. It may be image-only or corrupted.")
    sections = resume_parser.split_into_sections(full_text)
    months = resume_parser.estimate_experience_months(full_text)
    return {
        "text": full_text,
        "sections": sections,
        "candidate_months_experience": months,
        "word_count": len(full_text.split()),
    }


# ── Analysis ─────────────────────────────────────────────────────────────────

@app.post("/api/analysis/run")
def analysis_run(body: AnalysisBody):
    result = ats.compute_ats_score(
        body.resume_text, body.jd_text, body.sections,
        body.candidate_months_experience,
        jd_structured_skills=body.jd_structured_skills,
    )
    eligibility = ats.check_eligibility(result["required_years"], body.candidate_months_experience)
    result["eligibility"] = eligibility
    result["skill_categories"] = {
        "resume": matcher.categorize_skills(matcher.extract_skills(body.resume_text)),
        "jd": matcher.categorize_skills(matcher.extract_skills(body.jd_text)),
    }
    return result


@app.post("/api/analysis/strengths-weaknesses")
def strengths_weaknesses(body: StrengthsBody):
    return llm.generate_strengths_weaknesses(body.resume_text, body.jd_text, body.ats_result)


@app.post("/api/analysis/improve-bullet")
def improve_bullet(body: ImproveBulletBody):
    return llm.improve_bullet(body.bullet_text, body.jd_text)


# ── Company fit ──────────────────────────────────────────────────────────────

@app.post("/api/company/fit")
def company_fit(body: CompanyFitBody):
    profile = company_profiles.get_profile(body.company_name)
    if not profile:
        raise HTTPException(404, f"No profile found for '{body.company_name}'.")
    fit = ats.compute_company_fit(body.resume_text, profile)
    return {"profile": profile, "fit": fit}


@app.post("/api/company/feedback")
def company_feedback(body: CompanyFeedbackBody):
    profile = company_profiles.get_profile(body.company_name)
    if not profile:
        raise HTTPException(404, f"No profile found for '{body.company_name}'.")
    fit = ats.compute_company_fit(body.resume_text, profile)
    feedback = llm.generate_company_specific_feedback(
        body.resume_text, body.jd_text, body.ats_result, profile, fit
    )
    return {"profile": profile, "fit": fit, "feedback": feedback}


# ── Roadmap ──────────────────────────────────────────────────────────────────

@app.post("/api/roadmap")
def build_roadmap(body: RoadmapBody):
    weeks = roadmap.build_roadmap(
        body.missing_skills, total_weeks=body.total_weeks,
        company_missing_priority=body.company_missing_priority,
    )
    return {"weeks": weeks}


# ── Interview prep ───────────────────────────────────────────────────────────

@app.post("/api/interview-questions")
def interview_questions(body: InterviewBody):
    return llm.generate_interview_questions(body.resume_text, body.jd_text)


# ── Rewrite ──────────────────────────────────────────────────────────────────

@app.post("/api/rewrite-section")
def rewrite_section(body: RewriteSectionBody):
    return llm.rewrite_resume_section(
        body.resume_text, body.jd_text, body.section_name,
        body.section_content, body.missing_skills,
    )


# ── Similar roles ────────────────────────────────────────────────────────────

@app.post("/api/similar-roles")
def similar_roles(body: SimilarRolesBody):
    return llm.suggest_similar_jobs(body.jd_structured)


# ── PDF report ───────────────────────────────────────────────────────────────

@app.post("/api/report/pdf")
def pdf_report(body: ReportBody):
    pdf_bytes = report.build_pdf_report(
        body.jd_info, body.ats_result, body.strengths_weaknesses, body.roadmap
    )
    return StreamingResponse(
        io.BytesIO(pdf_bytes), media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=ResumeIQ_Report.pdf"},
    )


# ── Compare resumes / JDs ────────────────────────────────────────────────────

@app.post("/api/compare/resumes")
def compare_resumes(body: CompareResumesBody):
    resume_versions = [(v["label"], v["resume_text"]) for v in body.resume_versions]
    sections_list = [v.get("sections", {}) for v in body.resume_versions]
    months_list = [v.get("months", 0) for v in body.resume_versions]
    results = ats.compare_resumes(
        resume_versions, body.jd_text, sections_list, months_list,
        jd_structured_skills=body.jd_structured_skills,
    )
    return {"results": results}


@app.post("/api/compare/jds")
def compare_jds(body: CompareJDsBody):
    jd_versions = [(v["label"], v["jd_text"]) for v in body.jd_versions]
    results = ats.compare_jds(body.resume_text, jd_versions, body.sections, body.months)
    return {"results": results}


# ── History (requires auth) ──────────────────────────────────────────────────

@app.post("/api/history/resume-versions")
def save_resume_version(body: SaveResumeVersionBody, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(401, "Sign in to save resume versions.")
    vid = storage.save_resume_version(user["id"], body.label, body.resume_text, body.filename)
    return {"id": vid}


@app.get("/api/history/resume-versions")
def get_resume_versions(user=Depends(get_current_user)):
    if not user:
        return {"versions": []}
    return {"versions": storage.get_resume_versions(user["id"])}


@app.post("/api/history/analyses")
def save_analysis(body: SaveAnalysisBody, user=Depends(get_current_user)):
    if not user:
        raise HTTPException(401, "Sign in to save analysis history.")
    aid = storage.save_analysis(
        user["id"], body.resume_version_id, body.jd_label, body.jd_text,
        body.overall_score, body.breakdown, body.gap,
    )
    return {"id": aid}


@app.get("/api/history/analyses")
def get_analyses(user=Depends(get_current_user)):
    if not user:
        return {"analyses": []}
    return {"analyses": storage.get_analyses(user["id"])}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
