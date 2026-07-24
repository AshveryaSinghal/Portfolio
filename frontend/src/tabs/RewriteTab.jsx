import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { PenLine } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Spinner, EmptyState, EngineBadge } from "../components/shared";

export default function RewriteTab({ resumeText, jdText, sections, missingSkills }) {
  const availableSections = ["experience", "skills", "projects"].filter((s) => sections?.[s]);
  const [sectionName, setSectionName] = useState(availableSections[0] || "experience");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try {
      const content = sections?.[sectionName] || "";
      const r = await api.rewriteSection({
        resume_text: resumeText, jd_text: jdText, section_name: sectionName,
        section_content: content, missing_skills: missingSkills || [],
      });
      setResult(r);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!availableSections.length) {
    return <EmptyState icon={PenLine} title="No rewritable sections found" desc="We couldn't detect an Experience, Skills, or Projects section in your parsed resume." />;
  }

  return (
    <div className="animate-fade-up space-y-5">
      <Card className="p-6">
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">Rewrite section</div>
          <select
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-1.5 text-sm outline-none"
          >
            {availableSections.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
          <Button onClick={run} disabled={busy} variant="secondary" className="ml-auto">
            {busy ? "Rewriting…" : "Rewrite"}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Current</div>
            <pre className="whitespace-pre-wrap text-sm text-[var(--text-secondary)] bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] p-4 max-h-[420px] overflow-y-auto font-sans">
              {sections?.[sectionName]}
            </pre>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Rewritten</div>
            <div className="bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] p-4 max-h-[420px] overflow-y-auto">
              {busy && <Spinner label="Rewriting with AI…" />}
              {error && <div className="text-sm text-[var(--accent-red)]">{error}</div>}
              {result && (
                <>
                  <div className="prose prose-invert prose-sm max-w-none text-[var(--text-secondary)]">
                    <ReactMarkdown>{result.text}</ReactMarkdown>
                  </div>
                  <div className="mt-3"><EngineBadge engine={result.engine} /></div>
                </>
              )}
              {!busy && !result && !error && (
                <span className="text-sm text-[var(--text-muted)]">Click Rewrite to generate an improved version.</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
