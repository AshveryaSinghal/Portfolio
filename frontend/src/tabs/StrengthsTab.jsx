import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { api } from "../lib/api";
import { Card, Button, Spinner, EmptyState, EngineBadge } from "../components/shared";

export default function StrengthsTab({ resumeText, jdText, atsResult, onResult }) {
  const [sw, setSw] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [bullet, setBullet] = useState("");
  const [improved, setImproved] = useState(null);
  const [bulletBusy, setBulletBusy] = useState(false);

  async function run() {
    setBusy(true);
    setError("");
    try {
      const result = await api.strengthsWeaknesses({ resume_text: resumeText, jd_text: jdText, ats_result: atsResult });
      setSw(result);
      onResult?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function runBullet() {
    if (!bullet.trim()) return;
    setBulletBusy(true);
    try {
      const result = await api.improveBullet({ bullet_text: bullet, jd_text: jdText });
      setImproved(result);
    } catch (err) {
      setImproved({ text: `Error: ${err.message}`, engine: null });
    } finally {
      setBulletBusy(false);
    }
  }

  if (!atsResult) {
    return <EmptyState icon={Sparkles} title="Run the analysis first" desc="Strengths and weaknesses are grounded in your computed ATS score, so run Analysis before this step." />;
  }

  return (
    <div className="space-y-5 animate-fade-up">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
            Strengths & Weaknesses
          </div>
          <Button onClick={run} disabled={busy} variant="secondary">
            <span className="inline-flex items-center gap-1.5"><Sparkles size={13} /> Generate</span>
          </Button>
        </div>
        {busy && <Spinner label="Reading resume and JD…" />}
        {error && <div className="text-sm text-[var(--accent-red)]">{error}</div>}
        {sw && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-[var(--accent-green)] mb-2 font-semibold">Strengths</div>
              <ul className="space-y-2">
                {sw.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                    <span className="text-[var(--accent-green)]">+</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs text-[var(--accent-red)] mb-2 font-semibold">Weaknesses</div>
              <ul className="space-y-2">
                {sw.weaknesses.map((s, i) => (
                  <li key={i} className="text-sm text-[var(--text-secondary)] flex gap-2">
                    <span className="text-[var(--accent-red)]">−</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2"><EngineBadge engine={sw._engine} /></div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
          Bullet Point Improver
        </div>
        <textarea
          value={bullet}
          onChange={(e) => setBullet(e.target.value)}
          placeholder="Paste one resume bullet point to strengthen…"
          rows={3}
          className="w-full bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent-gold)]/50 resize-none mb-3"
        />
        <Button onClick={runBullet} disabled={bulletBusy} variant="secondary">
          <span className="inline-flex items-center gap-1.5"><Wand2 size={13} /> {bulletBusy ? "Rewriting…" : "Improve bullet"}</span>
        </Button>
        {improved && (
          <div className="mt-4 bg-[var(--bg-panel)] border border-[var(--border-subtle)] rounded-[var(--radius-sm)] p-4">
            <p className="text-sm text-[var(--text-primary)]">{improved.text}</p>
            <div className="mt-2"><EngineBadge engine={improved.engine} /></div>
          </div>
        )}
      </Card>
    </div>
  );
}
