import { AlertTriangle, CheckCircle2 } from "lucide-react";
import ScoreGauge from "../components/ScoreGauge";
import { Card, Chip, ScoreBar, EmptyState } from "../components/shared";

export default function AnalysisTab({ atsResult }) {
  if (!atsResult) {
    return <EmptyState icon={AlertTriangle} title="No analysis yet" desc="Load a resume and job description in the left panel, then run the full analysis." />;
  }

  const { overall, breakdown, keyword_gap, eligibility, skill_categories } = atsResult;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 animate-fade-up">
      <Card className="lg:col-span-2 p-7 flex flex-col items-center justify-center">
        <ScoreGauge score={overall} size={200} label="Overall ATS Match" />
      </Card>

      <Card className="lg:col-span-3 p-6">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
          Score Breakdown
        </div>
        <div className="space-y-4">
          <ScoreBar label="Skill match" value={breakdown.skill_match} />
          <ScoreBar label="Text similarity (TF-IDF)" value={breakdown.text_similarity} />
          <ScoreBar label="Experience match" value={breakdown.experience_match} />
          <ScoreBar label="Section completeness" value={breakdown.section_completeness} />
        </div>
      </Card>

      <Card className={`lg:col-span-5 p-6 border-l-4 ${eligibility.eligible ? "border-l-[var(--accent-green)]" : "border-l-[var(--accent-red)]"}`}>
        <div className="flex items-start gap-3">
          {eligibility.eligible ? (
            <CheckCircle2 size={18} className="text-[var(--accent-green)] mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-[var(--accent-red)] mt-0.5 shrink-0" />
          )}
          <div>
            <div className="font-semibold text-sm mb-1">
              {eligibility.eligible ? "Eligibility: meets requirement" : "Eligibility: below stated requirement"}
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{eligibility.reason}</div>
            {eligibility.recommendation && (
              <div className="text-sm text-[var(--accent-gold)] mt-1.5">{eligibility.recommendation}</div>
            )}
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-5 p-6">
        <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
          Keyword Gap Analysis
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Matched ({keyword_gap.matched.length})</div>
            <div className="flex flex-wrap gap-1.5">
              {keyword_gap.matched.length ? keyword_gap.matched.map((s) => <Chip key={s} tone="match">{s}</Chip>) : <span className="text-xs text-[var(--text-muted)]">None</span>}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Missing ({keyword_gap.missing.length})</div>
            <div className="flex flex-wrap gap-1.5">
              {keyword_gap.missing.length ? keyword_gap.missing.map((s) => <Chip key={s} tone="missing">{s}</Chip>) : <span className="text-xs text-[var(--text-muted)]">None</span>}
            </div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] mb-2">Extra on resume ({keyword_gap.extra.length})</div>
            <div className="flex flex-wrap gap-1.5">
              {keyword_gap.extra.length ? keyword_gap.extra.map((s) => <Chip key={s} tone="extra">{s}</Chip>) : <span className="text-xs text-[var(--text-muted)]">None</span>}
            </div>
          </div>
        </div>
      </Card>

      {skill_categories && (
        <Card className="lg:col-span-5 p-6">
          <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--text-muted)] mb-4">
            Skills by Category
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["resume", "jd"].map((side) => (
              <div key={side}>
                <div className="text-xs text-[var(--text-secondary)] mb-2 capitalize">{side === "resume" ? "On your resume" : "In the job description"}</div>
                <div className="space-y-2">
                  {Object.entries(skill_categories[side]).map(([cat, skills]) => (
                    <div key={cat} className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-[var(--text-muted)] w-32 shrink-0">{cat}</span>
                      {skills.map((s) => <Chip key={s} tone="neutral">{s}</Chip>)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
