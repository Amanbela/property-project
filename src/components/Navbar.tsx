"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MapPin, Compass, BookOpen, MessageSquare, ChevronRight, TrendingUp, Home, IndianRupee, BarChart3, ChevronDown } from "lucide-react";

const navLinks = [
  { href: "/",         label: "Home",            icon: Home },
  { href: "/areas",    label: "Area Insights",   icon: MapPin },
  { href: "/budget",   label: "Budget Guide",    icon: IndianRupee },
  { href: "/#wizard-section",  label: "Recommendations", icon: Compass },
  { href: "/blog",     label: "Market Insights",  icon: BookOpen },
  { href: "/#contact", label: "Contact",          icon: MessageSquare },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  const handleNavClick = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="container-main flex h-16 items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-bold text-slate-900 md:text-lg"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-xs font-bold">IP</span>
            <span>Indore <span className="text-brand-600">Property</span></span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map(({ href, label }) => {
              if (href === "/areas") {
                return (
                  <div key={href} className="relative group">
                    <Link
                      href={href}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      {label}
                      <ChevronDown size={13} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                    </Link>
                    <div className="absolute left-0 top-full mt-1 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                      <Link
                        href="/areas"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <MapPin size="15" />
                        All Areas
                      </Link>
                      <Link
                        href="/areas/compare"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        <BarChart3 size="15" />
                        Compare Areas
                      </Link>
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/#wizard-section" className="btn-primary text-sm py-2.5">
              Find My Area
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm md:hidden"
            />
            <motion.nav
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-5">
                <span className="font-display font-bold text-slate-900">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6">
                <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Navigation</p>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                  >
                    <Icon size={17} className="text-slate-400" />
                    {label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Explore</p>
                  <Link
                    href="/areas"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                  >
                    <TrendingUp size={17} className="text-slate-400" />
                    Top Investment Areas
                  </Link>
                  <Link
                    href="/areas"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                  >
                    <Home size={17} className="text-slate-400" />
                    Family-Friendly Areas
                  </Link>
                  <Link
                    href="/areas/compare"
                    onClick={handleNavClick}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-600"
                  >
                    <BarChart3 size={17} className="text-slate-400" />
                    Compare Areas
                  </Link>
                </div>
              </div>

              <div className="border-t border-slate-100 p-4">
                <Link
                  href="/#wizard-section"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full"
                >
                  Find My Area
                  <ChevronRight size={15} />
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
