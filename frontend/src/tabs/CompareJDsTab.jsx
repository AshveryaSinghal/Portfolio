import { useState } from "react";
import { Layers, Plus, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Chip, Spinner, EmptyState } from "../components/shared";

export default function CompareJDsTab({ resumeText, sections, months, jdText }) {
  const [extra, setExtra] = useState([{ label: "Alternate JD", text: "" }]);
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function updateExtra(i, field, value) {
    setExtra((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  }

  async function run() {
    if (!resumeText) return;
    setBusy(true);
    setError("");
    try {
      const jd_versions = [
        { label: "Current JD", jd_text: jdText },
        ...extra.filter((e) => e.text.trim()).map((e) => ({ label: e.label || "Untitled", jd_text: e.text })),
      ];
      const r = await api.compareJds({ resume_text: resumeText, sections: sections || {}, months: months || 0, jd_versions });
      setResults(r.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (!resumeText) {
    return <EmptyState icon={Layers} title="Upload a resume first" desc="Compare how your current resume scores against several different job postings, ranked best-fit first." />;
  }

  return (
    <div className="animate-fade-up space-y-5">
      <Card className="p-6">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
          Add job descriptions to compare
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
                placeholder="Paste this job description…"
              />
              <button onClick={() => setExtra((p) => p.filter((_, idx) => idx !== i))} className="text-[var(--text-muted)] hover:text-[var(--accent-red)] self-start md:self-center">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <Button variant="ghost" onClick={() => setExtra((p) => [...p, { label: `JD ${p.length + 2}`, text: "" }])}>
            <span className="inline-flex items-center gap-1.5"><Plus size={14} /> Add JD</span>
          </Button>
          <Button onClick={run} disabled={busy} className="ml-auto">
            {busy ? "Comparing…" : "Compare"}
          </Button>
        </div>
        {error && <div className="text-sm text-[var(--accent-red)] mt-2">{error}</div>}
      </Card>

      {busy && <Spinner label="Scoring each JD…" />}
      {results && (
        <div className="space-y-3">
          {results.map((r, i) => (
            <Card key={r.label} className="p-5 flex items-center gap-5">
              <div className="font-mono text-xs text-[var(--text-muted)] w-6">#{i + 1}</div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{r.label}</div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {r.keyword_gap.matched.slice(0, 8).map((s) => <Chip key={s} tone="match">{s}</Chip>)}
                </div>
              </div>
              <div className="font-display text-3xl text-[var(--accent-gold)] shrink-0">{r.overall}%</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
