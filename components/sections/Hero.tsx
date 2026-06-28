"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ashveryasinghal",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ashverya-singhal-27259a287/",
    icon: Linkedin,
  },
  {
    label: "Email",
    href: "mailto:ashveryasinghal@gmail.com",
    icon: Mail,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center pt-14"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-2xl"
        >
          {/* Status badge */}
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-1.5 text-xs text-fg-muted border border-rule rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Open to opportunities
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            variants={item}
            className="text-[clamp(2.5rem,6vw,4.25rem)] font-semibold tracking-[-0.04em] leading-[1.08] text-fg mb-4"
          >
            Ashverya
            <br />
            Singhal
          </motion.h1>

          {/* Title */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl font-medium text-fg-secondary tracking-tight mb-4"
          >
            ECE-AI
            <span className="text-rule mx-2 select-none">|</span>
            <span className="text-fg-muted font-normal">AI & Mobile Developer</span>
          </motion.p>

          {/* Description */}
          <motion.p
            variants={item}
            className="text-base text-fg-muted leading-relaxed max-w-[480px] mb-8"
          >
            Final-year ECE (AI) student at IGDTUW building AI-powered applications and mobile experiences. Recently completed an internship at Accenture and currently building ResumeIQ.

          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={item}
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <Button
              variant="primary"
              size="lg"
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href="/assets/Ashverya Resume 1.pdf"
              external
            >
              <FileText className="h-4 w-4" strokeWidth={1.75} />
              View Resume
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div variants={item} className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 flex items-center justify-center rounded-lg
                  text-fg-subtle hover:text-fg hover:bg-surface-secondary
                  transition-all duration-150"
                aria-label={label}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </a>
            ))}
            <div className="h-4 w-px bg-rule mx-2" />
            <span className="text-xs text-fg-subtle">
              ashveryasinghal@gmail.com
            </span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1.5"
        >
          <span className="text-xs text-fg-subtle tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            className="h-3.5 w-px bg-fg-subtle rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
}
