"use client";

import { Github, Linkedin } from "lucide-react";

const LINKS = [
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
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">

        {/* Left: name + role */}
        <div>
          <p className="text-sm font-semibold text-fg tracking-tight">Ashverya Singhal</p>
          <p className="text-xs text-fg-subtle mt-0.5">Software Engineer · AI &amp; Mobile Developer</p>
        </div>

        {/* Center: built with */}
        <p className="text-[11px] text-fg-subtle order-last sm:order-none text-left sm:text-center">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg transition-colors duration-150"
          >
            Next.js
          </a>
          {" & "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-fg transition-colors duration-150"
          >
            Tailwind CSS
          </a>
          <span className="mx-2 text-rule select-none">·</span>
          &copy; {year}
        </p>

        {/* Right: social icons */}
        <div className="flex items-center gap-1">
          {LINKS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-fg-subtle hover:text-fg hover:bg-surface-secondary transition-all duration-150"
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </a>
          ))}
        </div>

      </div>
    </footer>
  );
}
