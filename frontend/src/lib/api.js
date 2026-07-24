import axios from "axios";

const client = axios.create({ baseURL: `${import.meta.env.VITE_API_URL || ""}/api` });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("resumeiq_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function unwrap(promise) {
  return promise.then((r) => r.data).catch((err) => {
    const msg = err?.response?.data?.detail || err.message || "Request failed";
    throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
  });
}

export const api = {
  health: () => unwrap(client.get("/health")),
  llmStatus: () => unwrap(client.get("/llm/status")),

  signup: (username, password) => unwrap(client.post("/auth/signup", { username, password })),
  login: (username, password) => unwrap(client.post("/auth/login", { username, password })),
  logout: () => unwrap(client.post("/auth/logout")),
  me: () => unwrap(client.get("/auth/me")),

  companies: () => unwrap(client.get("/companies")),

  jdFromUrl: (url) => unwrap(client.post("/jd/from-url", { url })),
  jdStructure: (raw_text) => unwrap(client.post("/jd/structure", { raw_text })),

  resumeParse: (file) => {
    const form = new FormData();
    form.append("file", file);
    return unwrap(client.post("/resume/parse", form, { headers: { "Content-Type": "multipart/form-data" } }));
  },

  analysisRun: (body) => unwrap(client.post("/analysis/run", body)),
  strengthsWeaknesses: (body) => unwrap(client.post("/analysis/strengths-weaknesses", body)),
  improveBullet: (body) => unwrap(client.post("/analysis/improve-bullet", body)),

  companyFit: (body) => unwrap(client.post("/company/fit", body)),
  companyFeedback: (body) => unwrap(client.post("/company/feedback", body)),

  roadmap: (body) => unwrap(client.post("/roadmap", body)),

  interviewQuestions: (body) => unwrap(client.post("/interview-questions", body)),

  rewriteSection: (body) => unwrap(client.post("/rewrite-section", body)),

  similarRoles: (body) => unwrap(client.post("/similar-roles", body)),

  reportPdf: async (body) => {
    const res = await client.post("/report/pdf", body, { responseType: "blob" });
    return res.data;
  },

  compareResumes: (body) => unwrap(client.post("/compare/resumes", body)),
  compareJds: (body) => unwrap(client.post("/compare/jds", body)),

  saveResumeVersion: (body) => unwrap(client.post("/history/resume-versions", body)),
  getResumeVersions: () => unwrap(client.get("/history/resume-versions")),
  saveAnalysis: (body) => unwrap(client.post("/history/analyses", body)),
  getAnalyses: () => unwrap(client.get("/history/analyses")),
};
