"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Code2,
  Sparkles,
  Smartphone,
  Globe,
  Server,
  Wrench,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SkillCategory {
  id: string;
  label: string;
  Icon: React.ElementType;
  skills: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "languages",
    label: "Languages",
    Icon: Code2,
    skills: ["Java", "Python", "HTML", "JavaScript", "CSS", "SQL", "Dart"],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    Icon: Sparkles,
    skills: [
      "LLMs",
      "Gen AI",
      "NLP",
      "API",
      "Scikit-learn",
      "Pandas",
      "NumPy",
      "ML",
      "Prompt Engineering",
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    Icon: Smartphone,
    skills: [
      "Flutter",
      "Android Studio",
      "Firebase",
      "Firestore",
      "Google Play",
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    Icon: Globe,
    skills: ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML", "CSS"],
  },
  // {
  //   id: "backend",
  //   label: "Backend",
  //   Icon: Server,
  //   skills: ["FastAPI", "Streamlit", "REST APIs", "Firebase Functions", "Pytest", "Selenium"],
  // },
  {
    id: "tools",
    label: "Tools",
    Icon: Wrench,
    skills: ["Git", "GitHub", "VS Code", "Wireshark", "Postman", "CI/CD", "Linux"],
  },
];

// ─── Skill chip ───────────────────────────────────────────────────────────────

function SkillChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide border border-rule bg-surface-tertiary text-fg-muted whitespace-nowrap transition-colors duration-150 group-hover:border-fg-subtle/40">
      {label}
    </span>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────

function CategoryCard({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const { Icon, label, skills } = category;

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(
        "group rounded-xl border border-rule bg-surface-secondary p-5",
        "card-shadow card-shadow-hover transition-shadow duration-200"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-7 w-7 rounded-lg bg-surface-tertiary flex items-center justify-center shrink-0 transition-colors duration-150 group-hover:bg-surface-tertiary">
          <Icon className="h-3.5 w-3.5 text-fg-muted" strokeWidth={1.75} />
        </div>
        <p className="text-sm font-semibold text-fg tracking-tight">{label}</p>
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <SkillChip key={skill} label={skill} />
        ))}
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Skills() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="py-28 border-t border-rule">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-16"
        >
          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-fg max-w-xs leading-tight">
              Tools of the trade
            </h2>
            <p className="text-sm text-fg-muted max-w-[300px] sm:text-right leading-relaxed">
              Technologies I reach for daily - grouped by discipline.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SKILL_CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
