// "use client";

// import { useRef, useState } from "react";
// import { motion, useInView, useReducedMotion } from "framer-motion";
// import { Github, ArrowUpRight, Sparkles, Smartphone, Code2 } from "lucide-react";
// import { SectionLabel } from "@/components/ui/SectionLabel";
// import { Button } from "@/components/ui/Button";
// import { cn } from "@/lib/utils";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Project {
//   id: string;
//   title: string;
//   description: string;
//   longDescription: string;
//   tags: string[];
//   github: string;
//   demo: string | null;
//   featured: boolean;
//   accentColor: string;
//   placeholderIcon: React.ElementType;
//   placeholderLabel: string;
//   /** Optional real screenshot — lazy-loaded with skeleton */
//   screenshot?: string;
  
// }

// // ─── Data ─────────────────────────────────────────────────────────────────────

// const PROJECTS: Project[] = [
//   {
//     id: "resumeiq",
//     title: "ResumeIQ AI",
//     description: "AI-powered resume analysis and job-matching platform",
//     longDescription:
//       "ResumeIQ analyzes resumes against job descriptions using Large Language Models to identify skill gaps and evaluate ATS compatibility. It provides personalized feedback and actionable suggestions to help users build stronger, job-ready resumes.",
//     tags: ["Python", "LLM", "RAG", "Streamlit", "OpenAI", "Scikit-learn", "Pandas"],
//     github: "https://github.com/ashveryasinghal/resumeiq",
//     demo: "https://ashverya-resumeiq.streamlit.app/",
//     featured: true,
//     accentColor: "from-[#0070F3]/10 to-[#0070F3]/5",
//     placeholderIcon: Sparkles,
//     placeholderLabel: "ResumeIQ · AI Resume Analysis",
   
//   },
//   {
//     id: "santmarg",
//     title: "Santmarg Mobile App",
//     description: "Content Streaming & Audio Platform shipped to Google Play Store.",
//     longDescription:
//       "A Flutter application built and deployed independently, offering a seamless experience for accessing spiritual content. Features include background audio playback, voice search, personalized content, and real-time synchronization with Firebase.",
//     tags: ["Flutter", "Dart", "Firebase", "Firestore", "Android Studio", "Google Play"],
//     github: "https://github.com/ashveryasinghal/santmarg",
//     demo: "https://play.google.com/store/apps/details?id=com.ashverya.satsang_app",
//     featured: false,
//     accentColor: "from-emerald-500/10 to-emerald-500/5",
//     placeholderIcon: Smartphone,
//     placeholderLabel: "Santmarg · Mobile App",
//   },
//   // {
//   //   id: "placeholder",
//   //   title: "Next Project",
//   //   description: "Something new is in the works.",
//   //   longDescription:
//   //     "Currently ideating on a project at the intersection of 5G network intelligence and real-time LLM inference optimization — building on research from the COAI internship. Stay tuned.",
//   //   tags: ["5G", "LLM", "Networking", "Python", "Wireshark"],
//   //   github: "#",
//   //   demo: null,
//   //   featured: false,
//   //   accentColor: "from-violet-500/10 to-violet-500/5",
//   //   placeholderIcon: Code2,
//   //   placeholderLabel: "Coming Soon",
//   // },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function TechChip({ label }: { label: string }) {
//   return (
//     <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide border border-rule bg-surface-tertiary text-fg-muted whitespace-nowrap">
//       {label}
//     </span>
//   );
// }

// // ─── Screenshot placeholder / lazy image ─────────────────────────────────────

// interface ScreenshotProps {
//   accentColor: string;
//   Icon: React.ElementType;
//   label: string;
//   featured: boolean;
//   src?: string;
// }

// function Screenshot({ accentColor, Icon, label, featured, src }: ScreenshotProps) {
//   const [loaded, setLoaded] = useState(false);
//   const [error, setError] = useState(false);

//   const showReal = src && !error;

//   return (
//     <div
//       className={cn(
//         "relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-rule",
//         "bg-gradient-to-br",
//         accentColor
//       )}
//     >
//       {/* Subtle grid pattern */}
//       <div
//         className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
//         style={{
//           backgroundImage:
//             "linear-gradient(var(--fg) 1px, transparent 1px), linear-gradient(90deg, var(--fg) 1px, transparent 1px)",
//           backgroundSize: "28px 28px",
//         }}
//       />

//       {/* Fake browser chrome */}
//       <div className="absolute top-0 inset-x-0 h-8 border-b border-rule/60 bg-surface/60 backdrop-blur-sm flex items-center px-3 gap-1.5 z-10">
//         <span className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
//         <span className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
//         <span className="h-2 w-2 rounded-full bg-[#28c840]/60" />
//         <div className="flex-1 mx-3 h-4 rounded bg-rule/60" />
//       </div>

//       {/* Skeleton shimmer — visible until image loads */}
//       {showReal && !loaded && (
//         <div className="absolute inset-0 top-8 z-20">
//           <div className="h-full w-full bg-surface-tertiary animate-pulse" />
//         </div>
//       )}

//       {/* Real screenshot — lazy loaded */}
//       {showReal && (
//         // eslint-disable-next-line @next/next/no-img-element
//         <img
//           src={src}
//           alt={label}
//           loading="lazy"
//           decoding="async"
//           onLoad={() => setLoaded(true)}
//           onError={() => setError(true)}
//           className={cn(
//             "absolute inset-0 top-8 w-full h-[calc(100%-2rem)] object-cover object-top z-10",
//             "transition-opacity duration-500",
//             loaded ? "opacity-100" : "opacity-0"
//           )}
//         />
//       )}

//       {/* Placeholder icon + label — shown when no src or image failed */}
//       {(!showReal || (showReal && !loaded)) && (
//         <div className={cn(
//           "absolute inset-0 flex flex-col items-center justify-center gap-3 pt-4",
//           showReal && !loaded ? "opacity-0" : "opacity-100"
//         )}>
//           <div className="h-11 w-11 rounded-xl bg-surface/80 border border-rule/60 flex items-center justify-center shadow-sm">
//             <Icon className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
//           </div>
//           <span className="text-xs text-fg-subtle font-medium">{label}</span>
//         </div>
//       )}

//       {/* Featured glow */}
//       {featured && (
//         <div className="absolute -top-6 left-1/4 w-1/2 h-16 bg-[#0070F3]/20 blur-2xl rounded-full pointer-events-none" />
//       )}
//     </div>
//   );
// }

// // ─── Individual Project Card ──────────────────────────────────────────────────

// interface ProjectCardProps {
//   project: Project;
//   index: number;
// }

// function ProjectCard({ project, index }: ProjectCardProps) {
//   const ref = useRef<HTMLDivElement>(null);
//   const inView = useInView(ref, { once: true, margin: "-80px" });
//   const reduced = useReducedMotion();
//   const isEven = index % 2 === 0;
//   const slideFrom = isEven ? -24 : 24;

//   // Respect prefers-reduced-motion: skip translate, keep fade
//   const imageAnim = reduced
//     ? { initial: { opacity: 0 }, animate: inView ? { opacity: 1 } : {} }
//     : {
//         initial: { opacity: 0, x: -slideFrom },
//         animate: inView ? { opacity: 1, x: 0 } : {},
//       };

//   const textAnim = reduced
//     ? { initial: { opacity: 0 }, animate: inView ? { opacity: 1 } : {} }
//     : {
//         initial: { opacity: 0, x: slideFrom },
//         animate: inView ? { opacity: 1, x: 0 } : {},
//       };

//   return (
//     <motion.div
//       ref={ref}
//       initial={reduced ? { opacity: 0 } : { opacity: 0, y: 32 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.55, delay: 0.05, ease: [0.21, 0.47, 0.32, 0.98] }}
//       className={cn(
//         "group relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center",
//         !isEven && "lg:[direction:rtl]"
//       )}
//     >
//       <div className={cn(!isEven && "lg:[direction:ltr]")}>
//         <motion.div
//           {...imageAnim}
//           transition={{ duration: 0.55, delay: 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
//           whileHover={reduced ? undefined : { scale: 1.012, y: -3 }}
//           className="transition-transform duration-300 will-change-transform"
//         >
//           <Screenshot
//             accentColor={project.accentColor}
//             Icon={project.placeholderIcon}
//             label={project.placeholderLabel}
//             featured={project.featured}
//             src={project.screenshot}
//           />
//         </motion.div>
//       </div>

//       {/* Text content */}
//       <motion.div
//         {...textAnim}
//         transition={{ duration: 0.55, delay: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
//         className={cn("flex flex-col gap-4", !isEven && "lg:[direction:ltr]")}
//       >
//         <div className="flex items-center gap-2 flex-wrap">
//           {project.featured && (
//             <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border border-[var(--accent)]/30 bg-[var(--accent)]/8 text-accent">
//               <Sparkles className="h-3 w-3" strokeWidth={2} />
//               Featured
//             </span>
//           )}
//           <span className="text-xs text-fg-subtle font-medium">
//             {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
//           </span>
//         </div>

//         <div>
//           <h3 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-fg mb-2 leading-tight">
//             {project.title}
//           </h3>
//           <p className="text-sm font-medium text-fg-muted mb-3">
//             {project.description}
//           </p>
//           <p className="text-[14px] text-fg-subtle leading-relaxed">
//             {project.longDescription}
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-1.5">
//           {project.tags.map((tag) => (
//             <TechChip key={tag} label={tag} />
//           ))}
//         </div>

//         <div className="flex items-center gap-2 pt-1 flex-wrap">
//           <Button
//             variant="secondary"
//             size="sm"
//             href={project.github}
//             external
//             className={project.github === "#" ? "pointer-events-none opacity-40" : ""}
//           >
//             <Github className="h-3.5 w-3.5" strokeWidth={1.75} />
//             GitHub
//           </Button>
//           {project.demo ? (
//             <Button variant="primary" size="sm" href={project.demo} external>
//               <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
//               Live Demo
//             </Button>
//           ) : (
//             <span className="text-xs text-fg-subtle italic pl-1">Demo coming soon</span>
//           )}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─── Section ──────────────────────────────────────────────────────────────────

// export default function Projects() {
//   const headingRef = useRef<HTMLDivElement>(null);
//   const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
//   const reduced = useReducedMotion();

//   return (
//     <section id="projects" className="py-28 border-t border-rule">
//       <div className="max-w-5xl mx-auto px-5 sm:px-8">
//         <motion.div
//           ref={headingRef}
//           initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
//           animate={headingInView ? { opacity: 1, y: 0 } : {}}
//           transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
//           className="mb-20"
//         >
//           <SectionLabel>Projects</SectionLabel>
//           <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//             <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.03em] text-fg max-w-xs leading-tight">
//               Things I&apos;ve built.
//             </h2>
//             <p className="text-sm text-fg-muted max-w-[300px] sm:text-right leading-relaxed">
//               From shipped production apps to AI-powered tools — a selection of work I&apos;m proud of.
//             </p>
//           </div>
//         </motion.div>

//         <div className="flex flex-col gap-24">
//           {PROJECTS.map((project, i) => (
//             <div key={project.id}>
//               <ProjectCard project={project} index={i} />
//               {i < PROJECTS.length - 1 && (
//                 <div className="mt-24 h-px w-full bg-rule" />
//               )}
//             </div>
//           ))}
//         </div>

//         <motion.p
//           initial={{ opacity: 0 }}
//           whileInView={{ opacity: 1 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="mt-20 text-center text-xs text-fg-subtle"
//         >
//           More on{" "}
//           <a
//             href="https://github.com/ashveryasinghal"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-accent hover:underline underline-offset-2"
//           >
//             GitHub
//           </a>
//         </motion.p>
//       </div>
//     </section>
//   );
// }














































"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Github, ArrowUpRight, Sparkles, Smartphone } from "lucide-react";
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
  screenshot?: string;
}

const PROJECTS: Project[] = [
  {
    id: "resumeiq",
    title: "ResumeIQ AI",
    description: "AI-powered resume analysis and job-matching platform",
    longDescription:
      "ResumeIQ analyzes resumes against job descriptions using Large Language Models to identify skill gaps and evaluate ATS compatibility. It provides personalized feedback and actionable suggestions to help users build stronger, job-ready resumes.",
    tags: ["Python", "LLM", "RAG", "Streamlit", "OpenAI", "Scikit-learn", "Pandas"],
    github: "https://github.com/AshveryaSinghal/ResumeIQ-AI",
    demo: "https://ashverya-resumeiq.streamlit.app/",
    featured: true,
    accentColor: "from-[#0070F3]/10 to-[#0070F3]/5",
    placeholderIcon: Sparkles,
    placeholderLabel: "ResumeIQ · AI Resume Analysis",
    screenshot: "/assets/ResumeIQ Dash.png",
  },
  {
    id: "santmarg",
    title: "Santmarg Mobile App",
    description: "Content Streaming & Audio Platform shipped to Google Play Store.",
    longDescription:
      "A Flutter application built and deployed independently, offering a seamless experience for accessing spiritual content. Features include background audio playback, voice search, personalized content, and real-time synchronization with Firebase.",
    tags: ["Flutter", "Dart", "Firebase", "Firestore", "Android Studio", "Google Play"],
    github: "https://github.com/ashveryasinghal/santmarg",
    demo: "https://play.google.com/store/apps/details?id=com.ashverya.satsang_app",
    featured: false,
    accentColor: "from-emerald-500/10 to-emerald-500/5",
    placeholderIcon: Smartphone,
    placeholderLabel: "Santmarg · Mobile App",
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
  src?: string;
}

function Screenshot({ accentColor, Icon, label, featured, src }: ScreenshotProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const showReal = !!src && !error;

  return (
    <div
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
      <div className="absolute top-0 inset-x-0 h-8 border-b border-rule/60 bg-surface/60 backdrop-blur-sm flex items-center px-3 gap-1.5 z-10">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]/60" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]/60" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]/60" />
        <div className="flex-1 mx-3 h-4 rounded bg-rule/60" />
      </div>

      {/* Skeleton while loading */}
      {showReal && !loaded && (
        <div className="absolute inset-0 top-8 z-20">
          <div className="h-full w-full bg-surface-tertiary animate-pulse" />
        </div>
      )}

      {/* Real screenshot */}
      {showReal && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            "absolute inset-0 top-8 w-full h-[calc(100%-2rem)] object-cover object-top z-10",
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}

      {/* Placeholder: shown when no src or load failed */}
      {(!showReal || error) && (
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
            src={project.screenshot}
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