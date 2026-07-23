"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  
  // { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const sections = NAV_LINKS.map((l) =>
      document.querySelector(l.href)
    ).filter(Boolean) as Element[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          scrolled
            ? "bg-[var(--bg)]/90 backdrop-blur-md border-b border-rule"
            : "bg-transparent"
        )}
      >
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNav("#home");
            }}
            className="text-sm font-semibold tracking-tight text-fg hover:text-fg-secondary transition-colors"
          >
            Ashverya<span className="text-accent">.</span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-md transition-colors duration-150",
                  active === link.href.replace("#", "")
                    ? "text-fg font-medium"
                    : "text-fg-muted hover:text-fg"
                )}
              >
                {active === link.href.replace("#", "") && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-surface-tertiary rounded-md"
                    transition={{ type: "spring", duration: 0.3, bounce: 0.2 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="secondary"
              size="sm"
              href="/assets/Ashverya Resume 1.pdf"
              external
              className="hidden sm:inline-flex"
            >
              <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
              Resume
            </Button>
            {/* Mobile menu trigger */}
            <button
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg
                text-fg-muted hover:text-fg hover:bg-surface-tertiary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" strokeWidth={1.75} />
              ) : (
                <Menu className="h-4 w-4" strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-14 z-40 bg-[var(--bg)] border-b border-rule md:hidden"
          >
            <nav className="flex flex-col px-5 py-3 gap-0.5">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className={cn(
                    "text-left px-3 py-2.5 text-sm rounded-lg transition-colors",
                    active === link.href.replace("#", "")
                      ? "text-fg font-medium bg-surface-tertiary"
                      : "text-fg-muted hover:text-fg hover:bg-surface-secondary"
                  )}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 pb-1">
                <Button variant="secondary" size="sm" href="/resume.pdf" external className="w-full">
                  <FileText className="h-3.5 w-3.5" strokeWidth={1.75} />
                  View Resume
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
