import { useState } from "react";
import { Building2 } from "lucide-react";
import { api } from "../lib/api";
import { Card, Chip, Button, Spinner, EmptyState, EngineBadge } from "../components/shared";

export default function CompanyFitTab({ resumeText, jdText, atsResult, selectedCompany, onFitComputed }) {
  const [data, setData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [fbBusy, setFbBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    setFeedback(null);
    try {
      const result = await api.companyFit({ resume_text: resumeText, company_name: selectedCompany });
      setData(result);
      onFitComputed?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function runFeedback() {
    if (!atsResult) return;
    setFbBusy(true);
    try {
      const result = await api.companyFeedback({
        resume_text: resumeText, jd_text: jdText, ats_result: atsResult, company_name: selectedCompany,
      });
      setFeedback(result.feedback);
    } catch (err) {
      setFeedback({ text: `Error: ${err.message}`, engine: null });
    } finally {
      setFbBusy(false);
    }
  }

  if (!selectedCompany) {
    return <EmptyState icon={Building2} title="Pick a target company" desc="Choose a company from the sidebar to see how your resume stacks up against their known hiring priorities." />;
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
            {selectedCompany} — Fit Score
          </div>
          <Button onClick={run} disabled={busy} variant="secondary">Compute fit</Button>
        </div>
        {busy && <Spinner label="Comparing against company profile…" />}
        {error && <div className="text-sm text-[var(--accent-red)]">{error}</div>}
        {data && (
          <>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="font-display text-4xl text-[var(--accent-gold)]">{data.fit.fit_score}%</span>
              <span className="text-sm text-[var(--text-muted)]">of priority skills matched</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-xs text-[var(--accent-green)] mb-2 font-semibold">Matched priority skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {data.fit.matched_priority.length ? data.fit.matched_priority.map((s) => <Chip key={s} tone="match">{s}</Chip>) : <span className="text-xs text-[var(--text-muted)]">None yet</span>}
                </div>
              </div>
              <div>
                <div className="text-xs text-[var(--accent-red)] mb-2 font-semibold">Missing priority skills</div>
                <div className="flex flex-wrap gap-1.5">
                  {data.fit.missing_priority.length ? data.fit.missing_priority.map((s) => <Chip key={s} tone="missing">{s}</Chip>) : <span className="text-xs text-[var(--text-muted)]">None</span>}
                </div>
              </div>
            </div>
            <div className="h-px bg-[var(--border-subtle)] my-5" />
            <div className="text-sm text-[var(--text-secondary)] space-y-2">
              <p><strong className="text-[var(--text-primary)]">Culture & interview style:</strong> {data.profile.culture_notes}</p>
              <p><strong className="text-[var(--text-primary)]">Leveling:</strong> {data.profile.leveling_hint}</p>
              <p><strong className="text-[var(--text-primary)]">Hiring focus:</strong> {data.profile.hiring_focus}</p>
            </div>
          </>
        )}
      </Card>

      {data && atsResult && (
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
              Tailored Feedback
            </div>
            <Button onClick={runFeedback} disabled={fbBusy} variant="secondary">
              {fbBusy ? "Writing…" : "Generate feedback"}
            </Button>
          </div>
          {feedback && (
            <>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feedback.text}</p>
              <div className="mt-3"><EngineBadge engine={feedback.engine} /></div>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
