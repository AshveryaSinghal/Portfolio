import { useState } from "react";
import { GitCompare, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Chip, Spinner, EmptyState } from "../components/shared";

export default function CompareResumesTab({ resumeText, sections, months, jdText, jdStructuredSkills }) {
  const [extra, setExtra] = useState([{ label: "Alternate version", text: "" }]);
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function updateExtra(i, field, value) {
    setExtra((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }

  async function run() {
    if (!resumeText || !jdText) return;
    setBusy(true);
    setError("");
    try {
      const versions = [
        { label: "Current resume", resume_text: resumeText, sections: sections || {}, months: months || 0 },
        ...extra.filter((e) => e.text.trim()).map((e) => ({ label: e.label || "Untitled", resume_text: e.text, sections: {}, months: 0 })),
      ];
      const r = await api.compareResumes({ resume_versions: versions, jd_text: jdText, jd_structured_skills: jdStructuredSkills });
      setResults(r.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!resumeText || !jdText) {
    return <EmptyState icon={GitCompare} title="Load a resume and JD first" desc="Compare how different resume versions score against the same job description." />;
  }

  return (
    <div className="animate-fade-up space-y-5">
      <Card className="p-6">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
          Add resume versions to compare
        </div>
        <div className="space-y-4">
          {extra.map((e, i) => (
            <div key={i} className="flex flex-col md:flex-row gap-2">
              <input
                value={e.label}
                onChange={(ev) => updateExtra(i, "label", ev.target.value)}
                className="md:w-48 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm outline-none"
                placeholder="Label"
              />
              <textarea
                value={e.text}
                onChange={(ev) => updateExtra(i, "text", ev.target.value)}
                rows={2}
                className="flex-1 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3 py-2 text-sm outline-none resize-none"
                placeholder="Paste this resume version's text…"
              />
              <button onClick={() => setExtra((p) => p.filter((_, idx) => idx !== i))} className="text-[var(--text-muted)] hover:text-[var(--accent-red)] self-start md:self-center">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={() => setExtra((p) => [...p, { label: `Version ${p.length + 2}`, text: "" }])}>
            <span className="inline-flex items-center gap-1.5"><Plus size={14} /> Add version</span>
          </Button>
          <Button onClick={run} disabled={busy} className="ml-auto">
            {busy ? "Comparing…" : "Compare"}
          </Button>
        </div>
        {error && <div className="text-sm text-[var(--accent-red)] mt-2">{error}</div>}
      </Card>

      {busy && <Spinner label="Scoring each version…" />}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((r) => (
            <Card key={r.label} className="p-5">
              <div className="text-sm font-semibold mb-1">{r.label}</div>
              <div className="font-display text-3xl text-[var(--accent-gold)] mb-3">{r.overall}%</div>
              <div className="flex flex-wrap gap-1.5">
                {r.keyword_gap.matched.slice(0, 6).map((s) => <Chip key={s} tone="match">{s}</Chip>)}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
