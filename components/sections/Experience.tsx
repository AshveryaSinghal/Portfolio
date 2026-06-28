"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin, Calendar, ExternalLink } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Experience {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  duration: string;
  location: string;
  type: string; // "Internship" | "Part-time" | etc.
  tags: string[];
  achievements: string[];
  current?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERIENCES: Experience[] = [
  {
    id: "accenture",
    company: "Accenture",
    companyUrl: "https://www.accenture.com",
    role: "Associate Software Engineer Intern",
    duration: "May 2026 – Jul 2026",
    location: "Bengaluru, India",
    type: "Internship",
    tags: ["Python", "FastMCP", "OpenCV", "NumPy", "Pillow", "PyMuPDF", "BeautifulSoup4", "ImageHash"],
    achievements: [
      "Engineered a computer vision–powered QA automation system for validating digital marketing banners.",
      "Developed reusable validation pipelines with image processing, PDF parsing, and HTML analysis.",
      "Delivered deterministic, production-ready quality checks in seconds.",
    ],
    current: true,
  },
  {
    id: "coai",
    company: "COAI (Cellular Operators Association of India)",
    companyUrl: "https://www.coai.com",
    role: "AI Research Intern",
    duration: "Jan 2026 – Mar 2026",
    location: "Remote",
    type: "Internship",
    tags: ["Python", "Wireshark", "Scikit-learn", "Network Analysis", "ML"],
    achievements: [
      "Conducted research on AI-driven network traffic patterns and Large Language Model (LLM) inference.",
      "Analyzed packet-level traffic using Wireshark to study latency and network behavior.",
      "Explored Python-based approaches for automating traffic analysis and data collection.",
    ],
    current: false,
  },
  {
    id: "startup",
    company: "Mutual Node Private Limited",
    role: "Mobile App Developer Intern",
    duration: "Jun 2025 – Jul 2025",
    location: "Gurugram, India",
    type: "Internship",
    tags: ["Flutter", "Dart", "Firebase", "Firestore", "Android Studio", "Google Play"],
    achievements: [
      "Developed and maintained cross-platform mobile applications using Flutter and Dart.",
      "Integrated Firebase services, implemented real-time features, and optimized application performance.",
      "Managed the full release cycle - architecture, testing, and Play Store publishing.",
    ],
    current: false,
  },
];

// ─── Timeline dot ─────────────────────────────────────────────────────────────

function TimelineDot({ current }: { current?: boolean }) {
  return (
    <div className="relative flex items-center justify-center shrink-0 mt-[22px]">
      <div
        className={cn(
          "h-3 w-3 rounded-full border-2 z-10 transition-colors duration-200",
          current
            ? "bg-emerald-500 border-emerald-500"
            : "bg-surface border-rule group-hover:border-fg-subtle"
        )}
      />
      {current && (
        <span className="absolute h-3 w-3 rounded-full bg-emerald-500 animate-ping opacity-40" />
      )}
    </div>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className="group flex gap-5 sm:gap-7"
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <TimelineDot current={exp.current} />
        {/* Vertical line (hidden on last) */}
        <div className="flex-1 w-px bg-rule mt-2 group-last:hidden" />
      </div>

      {/* Card */}
      <div
        className={cn(
          "flex-1 mb-10 rounded-xl border border-rule bg-surface-secondary p-5 sm:p-6",
          "card-shadow card-shadow-hover transition-shadow duration-200"
        )}
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
          <div>
            {/* Company */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="text-[15px] font-semibold text-fg leading-snug">
                {exp.company}
              </h3>
              {exp.companyUrl && (
                <a
                  href={exp.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-subtle hover:text-fg transition-colors duration-150"
                  aria-label={`${exp.company} website`}
                >
                  <ExternalLink className="h-3 w-3" strokeWidth={1.75} />
                </a>
              )}
            </div>

            {/* Role */}
            <p className="text-sm font-medium text-fg-muted">{exp.role}</p>
          </div>

          {/* Right badges */}
          <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 shrink-0">
            <span
              className={cn(
                "inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide rounded-full px-2.5 py-0.5 border",
                exp.current
                  ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/8"
                  : "text-fg-subtle border-rule bg-surface-tertiary"
              )}
            >
              {exp.current && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              {exp.type}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-fg-subtle">
              <Calendar className="h-3 w-3" strokeWidth={1.75} />
              {exp.duration}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-fg-subtle">
              <MapPin className="h-3 w-3" strokeWidth={1.75} />
              {exp.location}
            </span>
          </div>
        </div>

        {/* Achievements */}
        <ul className="space-y-2 mb-4">
          {exp.achievements.map((ach, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] text-fg-muted leading-relaxed">
              <span className="mt-[7px] h-1 w-1 rounded-full bg-fg-subtle shrink-0" />
              {ach}
            </li>
          ))}
        </ul>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-rule">
          {exp.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide border border-rule bg-surface-tertiary text-fg-muted whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Experience() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });

  return (
    <section id="experience" className="py-28 border-t border-rule">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">

        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-16"
        >
          <SectionLabel>Experience</SectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-fg max-w-xs leading-tight">
              Where I&apos;ve worked.
            </h2>
            <p className="text-sm text-fg-muted max-w-[300px] sm:text-right leading-relaxed">
              Internships and contracts across AI, mobile, and network research.
            </p>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-3xl">
          {EXPERIENCES.map((exp, i) => (
            <ExperienceCard key={exp.id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
