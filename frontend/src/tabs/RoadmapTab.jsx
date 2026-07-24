import { useState, useEffect } from "react";
import { Map } from "lucide-react";
import { api } from "../lib/api";
import { Card, Chip, Spinner, EmptyState } from "../components/shared";

const PRIORITY_TONE = { High: "missing", Medium: "gold", Low: "neutral" };

export default function RoadmapTab({ atsResult, companyFitData, onWeeksComputed }) {
  const [weeks, setWeeks] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!atsResult) return;
    let cancelled = false;
    setBusy(true);
    api.roadmap({
      missing_skills: atsResult.keyword_gap.missing,
      company_missing_priority: companyFitData?.fit?.missing_priority || null,
    }).then((r) => { if (!cancelled) { setWeeks(r.weeks); onWeeksComputed?.(r.weeks); } })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [atsResult, companyFitData]);

  if (!atsResult) {
    return <EmptyState icon={Map} title="No roadmap yet" desc="Run the analysis to generate a week-by-week plan for closing your skill gaps." />;
  }

  return (
    <div className="animate-fade-up">
      {busy && <Spinner label="Building your roadmap…" />}
      {weeks && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeks.map((w) => (
            <Card key={w.week} className="p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                <div className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-wide">Week {w.week}</div>
                <Chip tone={PRIORITY_TONE[w.priority] || "neutral"}>{w.priority}</Chip>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {w.skills.map((s) => <Chip key={s} tone="gold">{s}</Chip>)}
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-2">{w.focus}</p>
              <p className="text-xs text-[var(--text-muted)]">Resource: {w.resource}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
