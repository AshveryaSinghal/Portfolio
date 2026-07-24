# ResumeIQ — AI Career Copilot

A full-stack rebuild of ResumeIQ: a **FastAPI** backend (your original scoring/matching
engine, unchanged) and a **React + Vite + Tailwind** frontend, replacing the Streamlit UI.

```
ResumeIQ/
├── backend/            FastAPI API — Python, reuses your original ATS/matching modules
├── frontend/            React + Vite + Tailwind SPA
└── streamlit_legacy/    Your original Streamlit app, kept as a working backup
```

## Why FastAPI instead of a Node backend?

Your scoring engine (`matcher.py`, `ats.py`) uses scikit-learn for TF-IDF similarity, and
`resume_parser.py` uses `pdfplumber` for PDF text extraction — both are Python-only,
battle-tested pieces of your app that already work correctly. Rewriting them in Node would
mean re-deriving the same statistics with different libraries and re-testing the ATS
scoring from scratch. Instead, that logic is kept exactly as-is and exposed as a clean
REST API, while the **entire frontend is React**, run and built with Node.js tooling
(Vite). If you'd like the API layer itself rewritten in Express/Node too, that's a
separate, doable follow-up — just ask.

---

## 1. Backend setup (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env`:

```env
GOOGLE_API_KEY=your_gemini_key_here     # get one at https://aistudio.google.com/apikey
GEMINI_MODEL_NAME=gemini-2.5-flash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL_PREFERENCE=llama3.2:1b,llama3.2,phi3.5,gemma2:2b,qwen2.5:3b,mistral
```

Run it:

```bash
python3 -m uvicorn main:app --reload --port 8000
```

API docs (interactive): http://localhost:8000/docs

### Local AI fallback (Ollama)

Every AI call (JD structuring, strengths/weaknesses, bullet rewriting, interview
questions, etc.) tries **Gemini first**. If Gemini errors out, hits a quota/rate limit,
or `GOOGLE_API_KEY` is left blank, it automatically retries against a **local Ollama
model** — so the app keeps working fully offline.

1. Install Ollama: https://ollama.com
2. Pull a small, fast model:
   ```bash
   ollama pull llama3.2:1b
   ```
3. That's it — no code changes needed. The backend auto-detects whichever model from
   `OLLAMA_MODEL_PREFERENCE` you have installed and uses the fastest one available.
   Every AI response in the UI shows a small badge (**Gemini** / **Ollama · local**) so
   you always know which engine actually answered.

**Verified working:** this fallback path was tested end-to-end with `GOOGLE_API_KEY`
left blank — `/api/llm/status` correctly reports `ollama_reachable: true` and picks up
the installed model, and calls like JD structuring and bullet rewriting both return
`"_engine": "ollama"` with correctly parsed responses. The app runs fully offline with
just Ollama installed; Gemini is optional.

---

## 2. Frontend setup (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Opens at http://localhost:5173 — API calls are proxied to `http://localhost:8000`
automatically (see `vite.config.js`), so run the backend first.

For a production build:

```bash
npm run build     # outputs to frontend/dist — serve with any static host
```

---

## 3. What's inside

All 11 capabilities from the original app, now as polished React views:

| Tab | What it does |
|---|---|
| Analysis | Overall ATS score (instrument-dial gauge), sub-score breakdown, eligibility check, keyword gap, skills by category |
| Strengths & Bullets | AI strengths/weaknesses grounded in your computed score, plus a single-bullet improver |
| Company Fit | Score against 15 companies' known hiring priorities + tailored feedback |
| Skill Roadmap | Week-by-week plan to close your skill gaps, sorted easiest-first |
| Interview Prep | HR, technical, and project-specific questions |
| Rewrite Section | Targeted rewrite of Experience / Skills / Projects |
| PDF Report | Downloadable report bundling score, gap, strengths, and roadmap |
| Dashboard | Score-over-time chart + saved resume versions (requires an account) |
| Compare Resumes | Same JD scored against multiple resume versions |
| Compare JDs | Same resume scored against multiple job postings |
| Similar Roles | AI-suggested comparable roles at other companies |

Auth is a lightweight bearer-token system (matches the original bcrypt-based auth) with a
**Continue as guest** option — guests get full analysis but no saved history.

## 4. Streamlit legacy backup

Your original app is untouched in `streamlit_legacy/`:

```bash
cd streamlit_legacy
pip install -r requirements.txt
cp .env.example .env   # add your GOOGLE_API_KEY
streamlit run app.py
```
