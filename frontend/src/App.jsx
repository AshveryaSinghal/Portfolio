import { useEffect, useState } from "react";
import {
  Gauge, Sparkles, Building2, Map, MessagesSquare, PenLine,
  FileDown, LayoutDashboard, GitCompare, Layers, Compass, Menu,
} from "lucide-react";
import { api } from "./lib/api";
import Auth from "./components/Auth";
import Sidebar from "./components/Sidebar";
import StepTracker from "./components/StepTracker";

import AnalysisTab from "./tabs/AnalysisTab";
import StrengthsTab from "./tabs/StrengthsTab";
import CompanyFitTab from "./tabs/CompanyFitTab";
import RoadmapTab from "./tabs/RoadmapTab";
import InterviewTab from "./tabs/InterviewTab";
import RewriteTab from "./tabs/RewriteTab";
import ReportTab from "./tabs/ReportTab";
import DashboardTab from "./tabs/DashboardTab";
import CompareResumesTab from "./tabs/CompareResumesTab";
import CompareJDsTab from "./tabs/CompareJDsTab";
import SimilarRolesTab from "./tabs/SimilarRolesTab";

const TABS = [
  { key: "analysis", label: "Analysis", icon: Gauge, Comp: AnalysisTab },
  { key: "strengths", label: "Strengths & Bullets", icon: Sparkles, Comp: StrengthsTab },
  { key: "company", label: "Company Fit", icon: Building2, Comp: CompanyFitTab },
  { key: "roadmap", label: "Skill Roadmap", icon: Map, Comp: RoadmapTab },
  { key: "interview", label: "Interview Prep", icon: MessagesSquare, Comp: InterviewTab },
  { key: "rewrite", label: "Rewrite Section", icon: PenLine, Comp: RewriteTab },
  { key: "report", label: "PDF Report", icon: FileDown, Comp: ReportTab },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, Comp: DashboardTab },
  { key: "compareResumes", label: "Compare Resumes", icon: GitCompare, Comp: CompareResumesTab },
  { key: "compareJds", label: "Compare JDs", icon: Layers, Comp: CompareJDsTab },
  { key: "similar", label: "Similar Roles", icon: Compass, Comp: SimilarRolesTab },
];

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [companies, setCompanies] = useState([]);
  const [llmStatus, setLlmStatus] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const [jdText, setJdText] = useState("");
  const [jdStructured, setJdStructured] = useState(null);

  const [resumeText, setResumeText] = useState("");
  const [sections, setSections] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [monthsExperience, setMonthsExperience] = useState(0);
  const [resumeVersionId, setResumeVersionId] = useState(null);

  const [atsResult, setAtsResult] = useState(null);
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [companyFitData, setCompanyFitData] = useState(null);
  const [strengthsWeaknesses, setStrengthsWeaknesses] = useState(null);
  const [roadmapWeeks, setRoadmapWeeks] = useState(null);

  const [activeTab, setActiveTab] = useState("analysis");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Bootstrap: auth check + reference data ──
  useEffect(() => {
    (async () => {
      try {
        const [{ user: me }, { companies: list }, status] = await Promise.all([
          api.me(), api.companies(), api.llmStatus(),
        ]);
        setUser(me);
        setCompanies(list);
        setLlmStatus(status);
      } catch {
        // ignore — treated as logged out
      } finally {
        setCheckingAuth(false);
      }
    })();
  }, []);

  function handleAuth(u) {
    setUser(u);
  }

  async function handleSignOut() {
    try { await api.logout(); } catch { /* noop */ }
    localStorage.removeItem("resumeiq_token");
    setUser(null);
    setJdText(""); setJdStructured(null);
    setResumeText(""); setSections(null); setAtsResult(null);
  }

  function handleResumeParsed(parsed, filename, versionLabel) {
    setResumeText(parsed.text);
    setSections(parsed.sections);
    setWordCount(parsed.word_count);
    setMonthsExperience(parsed.candidate_months_experience);
    setAtsResult(null);
    setCompanyFitData(null);
    setStrengthsWeaknesses(null);
    setRoadmapWeeks(null);

    if (user && !user.guest) {
      api.saveResumeVersion({
        label: versionLabel?.trim() || `Version ${Date.now()}`,
        resume_text: parsed.text,
        filename,
      }).then((r) => setResumeVersionId(r.id)).catch(() => {});
    }
  }

  async function runAnalysis() {
    setAnalysisBusy(true);
    try {
      const result = await api.analysisRun({
        resume_text: resumeText,
        jd_text: jdText,
        sections: sections || {},
        candidate_months_experience: monthsExperience,
        jd_structured_skills: jdStructured?.skills || null,
      });
      setAtsResult(result);
      setActiveTab("analysis");
    } catch (err) {
      alert(`Analysis failed: ${err.message}`);
    } finally {
      setAnalysisBusy(false);
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--text-muted)] text-sm">
        Loading ResumeIQ…
      </div>
    );
  }

  if (!user) {
    return <Auth onAuth={handleAuth} />;
  }

  const canRunAnalysis = !!resumeText && !!jdText;
  const ActiveComp = TABS.find((t) => t.key === activeTab)?.Comp || AnalysisTab;

  return (
    <div className="flex min-h-screen">
      {/* Mobile / tablet top bar — hidden at lg+, where the sidebar is always visible */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between gap-3 px-4 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 backdrop-blur">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-1.5 -ml-1.5 rounded-[var(--radius-sm)] hover:bg-white/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div className="font-display text-lg leading-none">ResumeIQ</div>
        <div className="w-8" aria-hidden="true" />
      </div>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onSignOut={handleSignOut}
        companies={companies}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        jdText={jdText}
        setJdText={setJdText}
        jdStructured={jdStructured}
        setJdStructured={setJdStructured}
        resumeText={resumeText}
        sections={sections}
        wordCount={wordCount}
        onResumeParsed={handleResumeParsed}
        llmStatus={llmStatus}
        canRunAnalysis={canRunAnalysis}
        onRunAnalysis={runAnalysis}
        analysisBusy={analysisBusy}
      />

      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <header className="border-b border-[var(--border-subtle)] px-4 sm:px-6 lg:px-8 py-5 lg:py-6 sticky top-14 lg:top-0 bg-[var(--bg-app)]/85 backdrop-blur z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 mb-5">
            <div>
              <h1 className="hidden sm:block font-display text-xl sm:text-2xl font-semibold leading-tight">ResumeIQ</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                AI Career Copilot — ATS scoring, keyword gaps, company fit, interview prep
              </p>
            </div>
          </div>
          <StepTracker
            completed={{
              resume: !!resumeText,
              jd: !!jdText,
              analysis: !!atsResult,
              improve: !!companyFitData,
              report: !!atsResult,
            }}
          />
        </header>

        <div className="px-4 sm:px-6 lg:px-8 pt-5">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-6 border-b border-[var(--border-subtle)]">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    active
                      ? "border-[var(--accent-gold)] text-[var(--text-primary)]"
                      : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <Icon size={14} /> {t.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 pb-16">
          <ActiveComp
            resumeText={resumeText}
            jdText={jdText}
            jdStructured={jdStructured}
            sections={sections}
            months={monthsExperience}
            atsResult={atsResult}
            selectedCompany={selectedCompany}
            onFitComputed={setCompanyFitData}
            companyFitData={companyFitData}
            missingSkills={atsResult?.keyword_gap?.missing || []}
            jdStructuredSkills={jdStructured?.skills || null}
            user={user}
            resumeVersionId={resumeVersionId}
            strengthsWeaknesses={strengthsWeaknesses}
            onResult={setStrengthsWeaknesses}
            roadmapWeeks={roadmapWeeks}
            onWeeksComputed={setRoadmapWeeks}
          />
        </div>
      </main>
    </div>
  );
}
