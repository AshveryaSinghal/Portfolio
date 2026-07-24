import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { LayoutDashboard, Save } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Spinner, EmptyState } from "../components/shared";

export default function DashboardTab({ user, atsResult, jdStructured, jdText, resumeVersionId }) {
  const [analyses, setAnalyses] = useState([]);
  const [versions, setVersions] = useState([]);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const [a, v] = await Promise.all([api.getAnalyses(), api.getResumeVersions()]);
      setAnalyses(a.analyses);
      setVersions(v.versions);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function saveCurrent() {
    if (!atsResult) return;
    setSaving(true);
    setSaved(false);
    try {
      await api.saveAnalysis({
        resume_version_id: resumeVersionId || null,
        jd_label: jdStructured?.job_title || "Untitled role",
        jd_text: jdText,
        overall_score: atsResult.overall,
        breakdown: atsResult.breakdown,
        gap: atsResult.keyword_gap,
      });
      setSaved(true);
      load();
    } finally {
      setSaving(false);
    }
  }

  if (user.guest) {
    return <EmptyState icon={LayoutDashboard} title="History needs an account" desc="Sign in (not as guest) to save resume versions and track your ATS score over time." />;
  }

  const chartData = analyses.map((a) => ({
    date: new Date(a.created_at * 1000).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: a.overall_score,
    label: a.jd_label,
  }));

  return (
    <div className="animate-fade-up space-y-5">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
            Score Over Time
          </div>
          {atsResult && (
            <Button onClick={saveCurrent} disabled={saving} variant="secondary">
              <span className="inline-flex items-center gap-1.5"><Save size={13} /> {saving ? "Saving…" : saved ? "Saved" : "Save current analysis"}</span>
            </Button>
          )}
        </div>
        {busy ? <Spinner label="Loading history…" /> : chartData.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)] py-8 text-center">No saved analyses yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#232D42" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#6B7690" fontSize={12} />
              <YAxis domain={[0, 100]} stroke="#6B7690" fontSize={12} />
              <Tooltip contentStyle={{ background: "#141C2C", border: "1px solid #232D42", borderRadius: 10, fontSize: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#F2B84B" strokeWidth={2.5} dot={{ fill: "#F2B84B", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-6">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
          Resume Versions
        </div>
        {versions.length === 0 ? (
          <div className="text-sm text-[var(--text-muted)]">No versions saved yet — upload a resume to save one automatically.</div>
        ) : (
          <div className="space-y-2">
            {versions.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-3 text-sm border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3.5 py-2.5">
                <span className="text-[var(--text-primary)] truncate">{v.label}</span>
                <span className="text-[var(--text-muted)] text-xs shrink-0 truncate max-w-[40%]">{v.filename || "—"}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
