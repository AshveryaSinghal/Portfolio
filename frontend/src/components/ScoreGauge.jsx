import { useEffect, useState } from "react";

function colorFor(score) {
  if (score >= 75) return { main: "#57D19A", soft: "rgba(87,209,154,0.15)" };
  if (score >= 50) return { main: "#F2B84B", soft: "rgba(242,184,75,0.15)" };
  return { main: "#F1685E", soft: "rgba(241,104,94,0.15)" };
}

/**
 * Instrument-panel style dial gauge — the app's signature visual element.
 * size: px diameter. thickness: stroke width. label under the number.
 */
export default function ScoreGauge({ score = 0, size = 200, thickness = 14, label = "Overall Match" }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 80);
    return () => clearTimeout(t);
  }, [score]);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  // Dial sweeps 270 degrees (like an analog gauge), starting at -225deg
  const sweep = 0.75; // fraction of full circle
  const arcLen = circumference * sweep;
  const offset = arcLen - (animated / 100) * arcLen;
  const color = colorFor(score);
  const tickCount = 27;

  return (
    <div className="relative flex flex-col items-center" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-[225deg]">
        {/* tick marks */}
        {Array.from({ length: tickCount }).map((_, i) => {
          const angle = (i / (tickCount - 1)) * 270;
          const rad = (angle * Math.PI) / 180;
          const rOuter = size / 2 - 2;
          const rInner = size / 2 - (i % 3 === 0 ? 9 : 5);
          const cx = size / 2;
          const cy = size / 2;
          const x1 = cx + rOuter * Math.cos(rad);
          const y1 = cy + rOuter * Math.sin(rad);
          const x2 = cx + rInner * Math.cos(rad);
          const y2 = cy + rInner * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#2A3550" strokeWidth={i % 3 === 0 ? 2 : 1} strokeLinecap="round" />
          );
        })}
        {/* track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="#1B2536" strokeWidth={thickness}
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeLinecap="round"
        />
        {/* progress */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color.main} strokeWidth={thickness}
          strokeDasharray={`${arcLen} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.16,1,.3,1), stroke 0.4s" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="font-display text-4xl font-semibold tabular-nums" style={{ color: color.main }}>
          {Math.round(animated)}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase mt-0.5">
          / 100
        </span>
      </div>
      <div className="mt-3 text-sm text-[var(--text-secondary)] font-medium text-center">{label}</div>
    </div>
  );
}
