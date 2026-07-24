import { Check } from "lucide-react";

const STEPS = [
  { key: "resume", label: "Resume" },
  { key: "jd", label: "Job Description" },
  { key: "analysis", label: "Analyze" },
  { key: "improve", label: "Improve" },
  { key: "report", label: "Report" },
];

export default function StepTracker({ completed = {} }) {
  return (
    <div className="flex items-center w-full overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const done = !!completed[step.key];
        const isLast = i === STEPS.length - 1;
        return (
          <div key={step.key} className="flex items-center flex-1 min-w-[110px] last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono border shrink-0 transition-colors ${
                  done
                    ? "bg-[var(--accent-gold)] border-[var(--accent-gold)] text-[#1A1206]"
                    : "border-[var(--border-strong)] text-[var(--text-muted)]"
                }`}
              >
                {done ? <Check size={12} /> : String(i + 1).padStart(2, "0").slice(-1)}
              </div>
              <span className={`text-xs whitespace-nowrap ${done ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-px flex-1 mx-3 ${done ? "bg-[var(--accent-gold)]/40" : "bg-[var(--border-subtle)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
