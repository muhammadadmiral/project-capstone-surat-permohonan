"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionUser } from "@/lib/auth";

type HeaderProps = {
  currentUser: SessionUser | null;
};

export default function Header({ currentUser }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const isAdmin = currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "MAHASISWA";

  const menuLinks = [
    { href: "#mulai", label: "Mulai" },
    { href: "#layanan", label: "Layanan" },
    { href: "#faq", label: "FAQ" },
    { href: "#kontak", label: "Kontak" },
  ];

  const primaryAction = currentUser
    ? isAdmin
      ? { href: "/admin", label: "Admin", icon: "shield_person" }
      : { href: "/dashboard", label: "Dashboard", icon: "space_dashboard" }
    : { href: "/login", label: "Masuk", icon: "login" };
  const secondaryAction = currentUser
    ? { href: "/settings", label: "Pengaturan", icon: "account_circle" }
    : { href: "/#layanan", label: "Lihat layanan", icon: "travel_explore" };

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 w-full border-b border-orange-100/70 bg-white/85 shadow-md backdrop-blur"
    >
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">FIK UPN Veteran Jakarta</div>
              <div className="text-xs text-gray-600">Layanan Persuratan</div>
            </div>
          </a>

          <div className="flex items-center gap-3 md:hidden">
            {currentUser && (
              <span className="rounded-full bg-orange-50 px-3 py-1 text-[11px] font-semibold text-orange-700 ring-1 ring-orange-200">
                {isAdmin ? "Admin" : "Mahasiswa"}
              </span>
            )}
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-orange-100 bg-white text-gray-700 shadow-sm"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-rounded">{open ? "close" : "menu"}</span>
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-orange-50/80 px-2 py-1 ring-1 ring-orange-100 shadow-sm">
              {menuLinks.map((link) => (
                <a key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
              {currentUser && (
                <span className="nav-link inline-flex items-center gap-1 text-orange-700">
                  <span className="material-symbols-rounded text-base">verified_user</span>
                  {isAdmin ? "Admin" : "Mahasiswa"}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={primaryAction.href}
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200/70 transition hover:bg-brand-600"
              >
                <span className="material-symbols-rounded text-base">{primaryAction.icon}</span>
                {primaryAction.label}
              </a>
              <a
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm transition hover:border-brand hover:text-brand-600"
              >
                <span className="material-symbols-rounded text-base">{secondaryAction.icon}</span>
                {secondaryAction.label}
              </a>
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-full border border-orange-100 bg-orange-50 px-3 py-2 text-xs font-semibold text-orange-800 hover:border-orange-200"
                >
                  <span className="material-symbols-rounded text-sm">logout</span>
                  Keluar
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-brand/80 via-brand to-brand/80 opacity-70" />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="md:hidden border-b border-orange-100/70 bg-white shadow-inner"
          >
            <div className="mx-auto max-w-6xl px-4 py-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {menuLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-orange-100 px-3 py-2 text-sm font-semibold text-gray-800 shadow-sm"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <a
                  href={primaryAction.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200/70 hover:bg-brand-600"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-rounded text-base">{primaryAction.icon}</span>
                  {primaryAction.label}
                </a>
                <a
                  href={secondaryAction.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-3 text-sm font-semibold text-brand shadow-sm hover:border-brand hover:text-brand-600"
                  onClick={() => setOpen(false)}
                >
                  <span className="material-symbols-rounded text-base">{secondaryAction.icon}</span>
                  {secondaryAction.label}
                </a>
                {currentUser && (
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-800 shadow-sm hover:border-orange-200"
                  >
                    <span className="material-symbols-rounded text-base">logout</span>
                    Keluar
                  </button>
                )}
              </div>
              {currentUser && (
                <div className="flex items-center gap-3 rounded-xl bg-orange-50/80 p-3 text-sm text-gray-800 ring-1 ring-orange-100">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-brand ring-1 ring-orange-200">
                    <span className="material-symbols-rounded text-lg">account_circle</span>
                  </div>
                  <div className="leading-tight">
                    <div className="font-semibold">{currentUser.name}</div>
                    <div className="text-xs text-gray-600">{currentUser.email}</div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function BrandMark() {
  return (
    <div className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 ring-1 ring-orange-200 text-brand">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M3 7l9-4 9 4-9 4-9-4Z" strokeLinejoin="round" />
        <path d="M7 10v5c0 1 1 2 3 3 4 1.6 8 1.6 12 0 2-.8 3-1.9 3-3v-5" opacity=".7" />
      </svg>
    </div>
  );
}

