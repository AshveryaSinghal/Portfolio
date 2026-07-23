"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "3+", label: "Internships" },
  { value: "10+", label: "Projects Built" },
  { value: "8.61", label: "CGPA / 10" },
  { value: "Top 100", label: "Flipkart Runway" },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();

  return (
    <section aria-label="Highlights" className="border-t border-rule">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
        <div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-rule rounded-xl overflow-hidden"
        >
          {STATS.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.45,
                delay: i * 0.07,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="group bg-surface-secondary hover:bg-surface-tertiary transition-colors duration-200 px-6 py-7 flex flex-col gap-1"
            >
              <span className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-fg tabular-nums leading-none">
                {value}
              </span>
              <span className="text-xs text-fg-subtle font-medium tracking-wide">
                {label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
