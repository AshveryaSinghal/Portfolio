import { useState, useRef, useEffect } from "react";
import { LogOut, Link2, FileText, Upload, Radar, Cpu, Cloud, X } from "lucide-react";
import { api } from "../lib/api";
import { Button, Spinner } from "./shared";

export default function Sidebar({
  user, onSignOut, companies, selectedCompany, setSelectedCompany,
  jdText, setJdText, jdStructured, setJdStructured,
  resumeText, sections, wordCount, onResumeParsed,
  llmStatus, canRunAnalysis, onRunAnalysis, analysisBusy,
  open = false, onClose,
}) {
  const [jdMode, setJdMode] = useState("paste");
  const [jdUrl, setJdUrl] = useState("");
  const [jdPaste, setJdPaste] = useState(jdText || "");
  const [jdBusy, setJdBusy] = useState(false);
  const [jdError, setJdError] = useState("");
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [versionLabel, setVersionLabel] = useState("");
  const fileRef = useRef(null);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  async function fetchFromUrl() {
    if (!jdUrl.trim()) return;
    setJdBusy(true);
    setJdError("");
    try {
      const { raw_text } = await api.jdFromUrl(jdUrl.trim());
      setJdText(raw_text);
      const structured = await api.jdStructure(raw_text);
      setJdStructured(structured);
    } catch (err) {
      setJdError(err.message);
    } finally {
      setJdBusy(false);
    }
  }

  async function useThisJd() {
    if (!jdPaste.trim()) return;
    setJdBusy(true);
    setJdError("");
    try {
      setJdText(jdPaste);
      const structured = await api.jdStructure(jdPaste);
      setJdStructured(structured);
    } catch (err) {
      setJdError(err.message);
    } finally {
      setJdBusy(false);
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeBusy(true);
    setResumeError("");
    try {
      const parsed = await api.resumeParse(file);
      onResumeParsed(parsed, file.name, versionLabel);
    } catch (err) {
      setResumeError(err.message);
    } finally {
      setResumeBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function runAnalysisAndClose() {
    onRunAnalysis();
    onClose?.();
  }

  return (
    <>
      {/* Backdrop — mobile/tablet only, while the drawer is open */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-[320px] h-[100dvh]
          border-r border-[var(--border-subtle)] bg-[var(--bg-panel)] flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto lg:w-[320px] lg:max-w-none lg:h-screen lg:sticky lg:top-0`}
      >
        <div className="p-5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[var(--accent-gold-soft)] border border-[var(--accent-gold)]/30 flex items-center justify-center shrink-0">
                <Radar size={15} className="text-[var(--accent-gold)]" />
              </div>
              <div className="font-display text-lg leading-none">ResumeIQ</div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 -mr-1"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-[var(--text-secondary)]">
              Signed in as <strong className="text-[var(--text-primary)]">{user.username}</strong>
              {user.guest && <span className="text-[var(--text-muted)]"> (guest)</span>}
            </div>
            <button onClick={onSignOut} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
          {llmStatus && (
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wide text-[var(--text-muted)]">
              {llmStatus.gemini_configured ? <Cloud size={11} /> : <Cpu size={11} />}
              {llmStatus.gemini_configured ? "Gemini primary" : "Gemini not configured"}
              {llmStatus.ollama_reachable && <span className="text-[var(--accent-gold)]">· Ollama ready</span>}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Target job */}
          <section>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2.5">
              Target Job
            </div>
            <select
              value={selectedCompany || "—"}
              onChange={(e) => setSelectedCompany(e.target.value === "—" ? null : e.target.value)}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm mb-3 outline-none focus:border-[var(--accent-gold)]/50"
            >
              <option>—</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <div className="flex text-xs bg-white/5 rounded-full p-1 mb-2.5">
              {["paste", "url"].map((m) => (
                <button
                  key={m}
                  onClick={() => setJdMode(m)}
                  className={`flex-1 py-1.5 rounded-full transition-all ${
                    jdMode === m ? "bg-[var(--accent-teal)] text-[#062622]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {m === "paste" ? "Paste text" : "From URL"}
                </button>
              ))}
            </div>

            {jdMode === "url" ? (
              <div className="space-y-2">
                <input
                  value={jdUrl}
                  onChange={(e) => setJdUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm outline-none focus:border-[var(--accent-gold)]/50"
                />
                <Button onClick={fetchFromUrl} disabled={jdBusy} className="w-full" variant="secondary">
                  <span className="inline-flex items-center gap-1.5"><Link2 size={13} /> Fetch JD</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={jdPaste}
                  onChange={(e) => setJdPaste(e.target.value)}
                  placeholder="Paste the full job description here…"
                  rows={5}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm outline-none focus:border-[var(--accent-gold)]/50 resize-none"
                />
                <Button onClick={useThisJd} disabled={jdBusy} className="w-full" variant="secondary">
                  Use this JD
                </Button>
              </div>
            )}

            {jdBusy && <Spinner label="Structuring with AI…" />}
            {jdError && <div className="text-xs text-[var(--accent-red)] mt-2">{jdError}</div>}

            {jdStructured && (
              <div className="mt-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5">
                <div className="text-sm font-semibold text-[var(--text-primary)]">{jdStructured.job_title || "—"}</div>
                <div className="text-xs text-[var(--text-muted)]">{jdStructured.company || "—"}</div>
              </div>
            )}
          </section>

          <div className="h-px bg-[var(--border-subtle)]" />

          {/* Resume */}
          <section>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-2.5">
              Resume
            </div>
            <input
              value={versionLabel}
              onChange={(e) => setVersionLabel(e.target.value)}
              placeholder="Version label (e.g. v2 — added Docker)"
              className="w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-xs mb-2 outline-none focus:border-[var(--accent-gold)]/50"
            />
            <label className="flex items-center justify-center gap-2 border border-dashed border-[var(--border-strong)] rounded-[var(--radius-sm)] py-3 text-xs text-[var(--text-secondary)] cursor-pointer hover:border-[var(--accent-gold)]/40 hover:text-[var(--text-primary)] transition-colors">
              <Upload size={14} />
              {resumeBusy ? "Parsing…" : "Upload PDF resume"}
              <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} disabled={resumeBusy} />
            </label>
            {resumeError && <div className="text-xs text-[var(--accent-red)] mt-2">{resumeError}</div>}

            {resumeText && (
              <div className="mt-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--text-primary)]">
                  <FileText size={13} /> {wordCount?.toLocaleString()} words
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">
                  {sections ? Object.keys(sections).length : 0} sections detected
                </div>
              </div>
            )}
          </section>

          {canRunAnalysis && (
            <Button onClick={runAnalysisAndClose} disabled={analysisBusy} className="w-full">
              {analysisBusy ? "Analyzing…" : "Run Full Analysis"}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
