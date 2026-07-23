"use client";

import { GraduationCap, BookOpen, Award, MapPin } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionLabel } from "@/components/ui/SectionLabel";

const EDUCATION = {
  institution: "Indira Gandhi Delhi Technical University for Women",
  shortName: "IGDTUW",
  degree: "B.Tech in Electronics and Communication Engineering",
  specialization: "Specializing in Artificial Intelligence",
  cgpa: "8.61 / 10",
  duration: "2023 – 2027",
  location: "Delhi, India",
};

const HIGHLIGHTS = [
  {
    icon: Award,
    label: "WISE Scholar",
    detail: "Top 15,000+ · 80% merit scholarship",
  },
  {
    icon: BookOpen,
    label: "Flipkart Runway",
    detail: "Top 100 of 45,000+ applicants",
  },
  {
    icon: GraduationCap,
    label: "Expected Graduation",
    detail: "May 2027",
  },
];

export default function About() {
  return (
    <section id="about" className="py-28 border-t border-rule">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24">
          {/* Left: Section header + summary */}
          <div>
            <FadeIn>
              <SectionLabel>About</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-fg mb-5">
                Building intelligent software with AI
              </h2>
              <div className="space-y-4 text-fg-muted text-[15px] leading-relaxed">
                <p>
                  I&apos;m a final-year ECE (AI) student at IGDTUW passionate about Artificial Intelligence and Software Development. I enjoy building AI-powered applications, mobile apps, and learning through hands-on projects.
                </p>
                <p>
                  My experience spans internships, hackathons, and personal projects, where I've worked with LLMs, Flutter, and Python to build practical solutions for real-world problems.
                </p>
                <p>
                  Outside of engineering, I mentor students in DSA, contribute
                  to developer communities, and stay close to research happening
                  at the intersection of 5G networks and large language models.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right: Education card + highlights */}
          <div className="space-y-4">
            {/* Education card */}
            <FadeIn delay={0.1}>
              <div
                className="rounded-xl border border-rule bg-surface-secondary p-6
                  card-shadow card-shadow-hover transition-shadow duration-200"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs text-fg-subtle font-medium tracking-wide uppercase mb-1">
                      Education
                    </p>
                    <h3 className="text-[15px] font-semibold text-fg leading-snug">
                      {EDUCATION.shortName}
                    </h3>
                    <p className="text-xs text-fg-muted mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3 w-3" strokeWidth={1.75} />
                      {EDUCATION.location}
                    </p>
                  </div>
                  <span className="text-xs text-fg-subtle border border-rule rounded-md px-2 py-1 whitespace-nowrap shrink-0">
                    {EDUCATION.duration}
                  </span>
                </div>

                <div className="space-y-1 mb-5">
                  <p className="text-sm text-fg font-medium">
                    {EDUCATION.degree}
                  </p>
                  <p className="text-sm text-fg-muted">
                    {EDUCATION.specialization}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-rule">
                  <span className="text-xs text-fg-subtle">CGPA</span>
                  <div className="flex-1 h-px bg-rule" />
                  <span className="text-sm font-semibold text-fg tabular-nums">
                    {EDUCATION.cgpa}
                  </span>
                </div>
              </div>
            </FadeIn>

            {/* Highlight pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, label, detail }, i) => (
                <FadeIn key={label} delay={0.15 + i * 0.07}>
                  <div
                    className="rounded-xl border border-rule bg-surface-secondary p-4
                      card-shadow card-shadow-hover transition-shadow duration-200 h-full"
                  >
                    <div className="h-7 w-7 rounded-lg bg-surface-tertiary flex items-center justify-center mb-3">
                      <Icon className="h-3.5 w-3.5 text-fg-muted" strokeWidth={1.75} />
                    </div>
                    <p className="text-sm font-medium text-fg leading-snug mb-0.5">
                      {label}
                    </p>
                    <p className="text-xs text-fg-subtle leading-snug">{detail}</p>
                  </div>
                </FadeIn>
              ))}
            </div>

            {/* Full institution name note */}
            <FadeIn delay={0.36}>
              <p className="text-xs text-fg-subtle px-1">
                {EDUCATION.institution}
              </p>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
