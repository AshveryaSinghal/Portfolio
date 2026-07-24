export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ eyebrow, title, desc }) {
  return (
    <div className="mb-5">
      {eyebrow && (
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[var(--accent-teal)] mb-1.5">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
      {desc && <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl">{desc}</p>}
    </div>
  );
}

export function Chip({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-[var(--bg-panel)] text-[var(--text-secondary)] border-[var(--border-subtle)]",
    good: "bg-[var(--accent-green-soft)] text-[var(--accent-green)] border-transparent",
    bad: "bg-[var(--accent-red-soft)] text-[var(--accent-red)] border-transparent",
    gold: "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border-transparent",
    teal: "bg-[var(--accent-teal-soft)] text-[var(--accent-teal)] border-transparent",
    match: "bg-[var(--accent-green-soft)] text-[var(--accent-green)] border-transparent",
    missing: "bg-[var(--accent-red-soft)] text-[var(--accent-red)] border-transparent",
    extra: "bg-[var(--accent-teal-soft)] text-[var(--accent-teal)] border-transparent",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Button({ children, variant = "primary", className = "", ...rest }) {
  const variants = {
    primary:
      "bg-[var(--accent-gold)] text-[#1A1206] hover:brightness-110 shadow-[0_8px_24px_-8px_rgba(242,184,75,0.5)]",
    secondary:
      "bg-[var(--bg-panel)] text-[var(--text-primary)] border border-[var(--border-strong)] hover:border-[var(--accent-teal)]",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    danger: "bg-[var(--accent-red-soft)] text-[var(--accent-red)] hover:brightness-110",
  };
  return (
    <button
      className={`px-4 py-2.5 rounded-[var(--radius-sm)] text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ProgressBar({ label, value, tone = "gold" }) {
  const colors = { gold: "var(--accent-gold)", teal: "var(--accent-teal)", green: "var(--accent-green)", red: "var(--accent-red)" };
  return (
    <div className="mb-3.5">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-[var(--text-secondary)] font-medium">{label}</span>
        <span className="font-mono text-[var(--text-primary)]">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-[var(--bg-panel)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%`, background: colors[tone] }}
        />
      </div>
    </div>
  );
}

export const ScoreBar = ProgressBar;

export function EngineBadge({ engine }) {
  if (!engine) return null;
  const isLocal = engine === "ollama";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider border ${
        isLocal
          ? "bg-[var(--accent-teal-soft)] text-[var(--accent-teal)] border-transparent"
          : "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border-transparent"
      }`}
      title={isLocal ? "Answered by your local Ollama model (Gemini unavailable)" : "Answered by Gemini"}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "currentColor" }} />
      {isLocal ? "Local Ollama" : "Gemini"}
    </span>
  );
}

export function Spinner({ label = "Working..." }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)] py-6 justify-center">
      <span className="w-4 h-4 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent-gold)] animate-spin" />
      {label}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="text-center py-14 border border-dashed border-[var(--border-subtle)] rounded-[var(--radius-md)]">
      {Icon && (
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--bg-panel)] mb-3.5">
          <Icon size={20} className="text-[var(--text-muted)]" />
        </div>
      )}
      <div className="font-display text-lg font-medium text-[var(--text-primary)]">{title}</div>
      <div className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">{desc}</div>
    </div>
  );
}

export function ErrorNote({ children }) {
  if (!children) return null;
  return (
    <div className="text-sm text-[var(--accent-red)] bg-[var(--accent-red-soft)] border border-transparent rounded-[var(--radius-sm)] px-3.5 py-2.5 mb-4">
      {children}
    </div>
  );
}
