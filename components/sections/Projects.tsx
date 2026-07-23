
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Github, ArrowUpRight, Sparkles, Smartphone, Camera, Search, ShieldAlert } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  tags: string[];
  github: string;
  demo: string | null;
  featured: boolean;
  accentColor: string;
  placeholderIcon: React.ElementType;
  placeholderLabel: string;
  /** One or more screenshots. With 2+, the card auto-advances through them on hover. */
  screenshots?: string[];
}

const PROJECTS: Project[] = [
  {
    id: "shelfmind",
    title: "ShelfMind: AI Shelf Monitoring",
    description: "Computer-vision retail shelf monitoring with health scoring and restocking priority",
    longDescription:
      "A full-stack computer vision system that turns a single shelf photo into an actionable retail-ops report. A YOLO11 model fine-tuned on SKU-110K detects individual products, improving detection recall by 24% via confidence-threshold calibration; a deterministic analytics layer computes occupancy, gaps, and a 0-100 health score; a rules engine outputs a restocking priority; and a local LLM assistant answers free-text questions grounded strictly in that computed data, exposed through a 7-endpoint REST API.",
    tags: ["Python", "FastAPI", "YOLO11", "OpenCV", "React", "TypeScript", "SQLite"],
    github: "https://github.com/AshveryaSinghal/ShelfMind-AI",
    demo: null, // no live demo link provided yet
    featured: true,
    accentColor: "from-[#0070F3]/10 to-[#0070F3]/5",
    placeholderIcon: Camera,
    placeholderLabel: "ShelfMind · Shelf Monitoring",
    screenshots: ["/assets/shelfmind.png",
      "/assets/scan.png",
      "/assets/critical.png",
      "/assets/Ai.png",

    ],
  },
  {
    id: "visualfind",
    title: "VisualFind: Visual Product Search",
    description: "Visual product search returning live prices from 11 trusted retailers",
    longDescription:
      "A full-stack visual product search platform: upload a photo, identify the product via Google Lens, and get purchase links with live prices sorted cheapest-first. A 7-tier price-extraction pipeline (Google Shopping, structured page metadata, headless-browser rendering, currency normalization, and validation) resolves a real selling price per retailer, while domain allowlisting acts as an anti-scam layer restricting results to trusted e-commerce platforms only.",
    tags: ["Python", "FastAPI", "React", "TypeScript", "SerpApi", "SQLite"],
    github: "https://github.com/AshveryaSinghal/VisualFind",
    demo: "https://visual-find-379jgj90k-ashverya.vercel.app/",
    featured: true,
    accentColor: "from-violet-500/10 to-violet-500/5",
    placeholderIcon: Search,
    placeholderLabel: "VisualFind · Visual Product Search",
    screenshots: ["/assets/Visual Find.png",
      "/assets/search.png",
      "/assets/history.png",
      "/assets/analysis.png"
    ],
  },
  {
    id: "finguard",
    title: "FinGuard",
    description: "Full-stack fraud-ops platform with payment risk scoring and analyst workflows",
    longDescription:
      "A full-stack fraud-operations platform built on 590K+ IEEE-CIS transactions. A payment risk-scoring model (ROC-AUC 0.91) runs against a reproducible feature store and maps probabilities through defined thresholds into Low/Monitor/Review/Automatic-case tiers, driving analyst alerts and investigations with status tracking, notes, and resolution. An offline drift-monitoring workspace tracks model stability via Population Stability Index, and an experimental URL-risk model is shipped transparently disabled after failing independent stress tests, rather than papering over it with a hand-maintained allowlist.",
    tags: ["Python", "TypeScript", "FastAPI", "React", "Scikit-learn"],
    github: "https://github.com/AshveryaSinghal/FinGuard",
    demo: "https://finguard-48qly8l3r-ashverya.vercel.app",
    featured: true,
    accentColor: "from-rose-500/10 to-rose-500/5",
    placeholderIcon: ShieldAlert,
    placeholderLabel: "FinGuard · Fraud Ops Platform",
    screenshots: ["/assets/FinGuard.png",
      "/assets/transction.png",
      "/assets/aler.png",
      "/assets/model.png",
      "/assets/eval.png"

    ],
  },
];

// ─── Other Projects (compact list) ─────────────────────────────────────────
// Add more entries here any time — no layout changes needed.

interface OtherProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo: string | null;
  icon: React.ElementType;
  screenshot?: string;
}

const OTHER_PROJECTS: OtherProject[] = [
  {
    id: "resumeiq",
    title: "ResumeIQ AI",
    description:
      "AI-powered resume analysis and job-matching platform using LLMs to identify skill gaps and evaluate ATS compatibility.",
    tags: ["Python", "LLM", "RAG", "Streamlit", "OpenAI"],
    github: "https://github.com/AshveryaSinghal/ResumeIQ-AI",
    demo: "https://ashverya-resumeiq.streamlit.app/",
    icon: Sparkles,
    screenshot: "/assets/ResumeIQ Dash.png",
  },
  {
    id: "santmarg",
    title: "Santmarg Mobile App",
    description:
      "Content streaming & audio platform shipped to the Google Play Store for a target audience of 50k+ users.",
    tags: ["Flutter", "Dart", "Firebase", "Firestore"],
    github: "https://github.com/ashveryasinghal/santmarg",
    demo: "https://play.google.com/store/apps/details?id=com.ashverya.satsang_app",
    icon: Smartphone,
    screenshot: "/assets/santmarg.png",
  },
];

function TechChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide border border-rule bg-surface-tertiary text-fg-muted whitespace-nowrap">
      {label}
    </span>
  );
}

interface ScreenshotProps {
  accentColor: string;
  Icon: React.ElementType;
  label: string;
  featured: boolean;
  /** One or more images. 2+ auto-advance in a contained slideshow on hover. */
  images?: string[];
  reducedMotion?: boolean;
}

function Screenshot({ accentColor, Icon, label, featured, images, reducedMotion }: ScreenshotProps) {
  const gallery = (images ?? []).filter(Boolean);
  const hasGallery = gallery.length > 0;
  const multiSlide = gallery.length > 1;

  const [firstLoaded, setFirstLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const showReal = hasGallery && !error;

  const stopAutoplay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => stopAutoplay, []);

  const handleMouseEnter = () => {
    if (!multiSlide || reducedMotion) return;
    setIsHovering(true);
    stopAutoplay();
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % gallery.length);
    }, 1400);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    stopAutoplay();
    setActiveIndex(0);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-rule",
        "bg-gradient-to-br",
        accentColor
      )}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Browser chrome */}
      <div className="absolute top-0 inset-x-0 h-8 border-b border-rule/60 bg-surface/60 backdrop-blur-sm flex items-center px-3 gap-1.5 z-20">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/60" />
        <div className="flex-1 mx-3 h-4 rounded bg-rule/60" />
      </div>

      {/* Skeleton while first image loads */}
      {showReal && !firstLoaded && (
        <div className="absolute inset-0 top-8 z-10">
          <div className="h-full w-full bg-surface-tertiary animate-pulse" />
        </div>
      )}

      {/* Sliding image track — clipped within the frame */}
      {showReal && (
        <div className="absolute inset-0 top-8 overflow-hidden z-10">
          <div
            className="flex h-full will-change-transform"
            style={{
              width: `${gallery.length * 100}%`,
              transform: `translateX(-${(activeIndex * 100) / gallery.length}%)`,
              transition: reducedMotion
                ? "none"
                : "transform 700ms cubic-bezier(0.65, 0, 0.35, 1)",
            }}
          >
            {gallery.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt={`${label} — screenshot ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                onLoad={() => i === 0 && setFirstLoaded(true)}
                onError={() => i === 0 && setError(true)}
                className={cn(
                  "h-full object-cover object-top shrink-0",
                  "transition-opacity duration-500",
                  firstLoaded ? "opacity-100" : "opacity-0"
                )}
                style={{ width: `${100 / gallery.length}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Slide indicators */}
      {showReal && multiSlide && (
        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-20">
          {gallery.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                i === activeIndex
                  ? "w-4 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                  : "w-1 bg-white/50"
              )}
            />
          ))}
        </div>
      )}

      {/* Hover hint for galleries — fades in only when idle */}
      {showReal && multiSlide && (
        <div
          className={cn(
            "absolute top-11 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full",
            "bg-surface/80 border border-rule/60 backdrop-blur-sm text-[10px] font-medium text-fg-subtle",
            "transition-opacity duration-300",
            isHovering ? "opacity-0" : "opacity-100"
          )}
        >
          <Camera className="h-2.5 w-2.5" strokeWidth={2} />
          {gallery.length}
        </div>
      )}

      {/* Placeholder: shown when no images or load failed */}
      {!showReal && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pt-4">
          <div className="h-11 w-11 rounded-xl bg-surface/80 border border-rule/60 flex items-center justify-center shadow-sm">
            <Icon className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
          </div>
          <span className="text-xs text-fg-subtle font-medium">{label}</span>
        </div>
      )}

      {/* Featured glow */}
      {featured && (
        <div className="absolute -top-6 left-1/4 w-1/2 h-16 bg-[#0070F3]/20 blur-2xl rounded-full pointer-events-none" />
      )}
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const isEven = index % 2 === 0;
  const slideFrom = isEven ? -24 : 24;

  const imageAnim = reduced
    ? { initial: { opacity: 0 }, animate: inView ? { opacity: 1 } : {} }
    : {
        initial: { opacity: 0, x: -slideFrom },
        animate: inView ? { opacity: 1, x: 0 } : {},
      };

  const textAnim = reduced
    ? { initial: { opacity: 0 }, animate: inView ? { opacity: 1 } : {} }
    : {
        initial: { opacity: 0, x: slideFrom },
        animate: inView ? { opacity: 1, x: 0 } : {},
      };

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "group relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center",
        !isEven && "lg:[direction:rtl]"
      )}
    >
      <div className={cn(!isEven && "lg:[direction:ltr]")}>
        <motion.div
          {...imageAnim}
          transition={{ duration: 0.55, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
          whileHover={reduced ? undefined : { scale: 1.012, y: -3 }}
          className="transition-transform duration-300 will-change-transform"
        >
          <Screenshot
            accentColor={project.accentColor}
            Icon={project.placeholderIcon}
            label={project.placeholderLabel}
            featured={project.featured}
            images={project.screenshots}
            reducedMotion={!!reduced}
          />
        </motion.div>
      </div>

      <motion.div
        {...textAnim}
        transition={{ duration: 0.55, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn("flex flex-col gap-4", !isEven && "lg:[direction:ltr]")}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border border-[var(--accent)]/30 bg-[var(--accent)]/8 text-accent">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
              Featured
            </span>
          )}
          <span className="text-xs text-fg-subtle font-medium">
            {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
          </span>
        </div>

        <div>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-fg mb-2 leading-tight">
            {project.title}
          </h3>
          <p className="text-sm font-medium text-fg-muted mb-3">
            {project.description}
          </p>
          <p className="text-[14px] text-fg-subtle leading-relaxed">
            {project.longDescription}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <TechChip key={tag} label={tag} />
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            href={project.github}
            external
            className={project.github === "#" ? "pointer-events-none opacity-40" : ""}
          >
            <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
            GitHub
          </Button>
          {project.demo ? (
            <Button variant="primary" size="sm" href={project.demo} external>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              Live Demo
            </Button>
          ) : (
            <span className="text-xs text-fg-subtle italic pl-1">Demo coming soon</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function OtherProjectCard({ project, index }: { project: OtherProject; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const Icon = project.icon;

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const showThumb = !!project.screenshot && !error;

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 3) * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="group flex flex-col gap-3 p-5 rounded-2xl border border-rule bg-surface-secondary hover:border-[var(--accent)]/40 transition-colors duration-300"
    >
      {/* Pic — compact thumbnail, only takes up space when a screenshot exists */}
      {showThumb && (
        <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-rule/60 bg-surface-tertiary">
          {!loaded && <div className="absolute inset-0 bg-surface-tertiary animate-pulse" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.screenshot}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={() => setError(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover object-top",
              "transition-all duration-500 group-hover:scale-[1.03]",
              loaded ? "opacity-100" : "opacity-0"
            )}
          />
          <div className="absolute top-1.5 left-1.5 h-6 w-6 rounded-md bg-surface/90 border border-rule/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Icon className="h-3 w-3 text-fg-muted" strokeWidth={1.75} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {!showThumb && (
          <div className="h-9 w-9 rounded-lg bg-surface-tertiary border border-rule/60 flex items-center justify-center">
            <Icon className="h-4 w-4 text-fg-muted" strokeWidth={1.75} />
          </div>
        )}
        <div className={cn("flex items-center gap-1.5", showThumb && "ml-auto")}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 w-7 rounded-md flex items-center justify-center text-fg-subtle hover:text-fg hover:bg-surface-tertiary transition-colors"
            aria-label={`${project.title} GitHub repository`}
          >
            <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="h-7 w-7 rounded-md flex items-center justify-center text-fg-subtle hover:text-fg hover:bg-surface-tertiary transition-colors"
              aria-label={`${project.title} live demo`}
            >
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
            </a>
          )}
        </div>
      </div>

      {/* Detail */}
      <div>
        <h4 className="text-base font-semibold tracking-[-0.02em] text-fg mb-1">
          {project.title}
        </h4>
        <p className="text-[13px] text-fg-subtle leading-relaxed">{project.description}</p>
      </div>

      {/* Tech */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
        {project.tags.map((tag) => (
          <TechChip key={tag} label={tag} />
        ))}
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();

  return (
    <section id="projects" className="py-28 border-t border-rule">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.div
          ref={headingRef}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-20"
        >
          <SectionLabel>Projects</SectionLabel>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-fg max-w-xs leading-tight">
              Things I&apos;ve built.
            </h2>
            <p className="text-sm text-fg-muted max-w-[300px] sm:text-right leading-relaxed">
              From shipped production apps to AI-powered tools — a selection of work I&apos;m proud of.
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-24">
          {PROJECTS.map((project, i) => (
            <div key={project.id}>
              <ProjectCard project={project} index={i} />
              {i < PROJECTS.length - 1 && (
                <div className="mt-24 h-px w-full bg-rule" />
              )}
            </div>
          ))}
        </div>

        {OTHER_PROJECTS.length > 0 && (
          <div className="mt-28">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-fg mb-6">
              Other Projects
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {OTHER_PROJECTS.map((project, i) => (
                <OtherProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          </div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-20 text-center text-xs text-fg-subtle"
        >
          More on{" "}
          <a
            href="https://github.com/ashveryasinghal"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-2"
              >
            GitHub
          </a>
        </motion.p>
      </div>
    </section>
  );
}