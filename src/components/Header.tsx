"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SessionUser } from "@/lib/auth";

type HeaderProps = {
  currentUser: SessionUser | null;
};

export default function Header({ currentUser }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState<"id" | "en">("id");
  const isAdmin = currentUser?.role === "ADMIN";
  const isStudent = currentUser?.role === "MAHASISWA";
  const initials = currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "AK";

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

  useEffect(() => {
    const storedTheme = (typeof window !== "undefined" && localStorage.getItem("theme")) as "light" | "dark" | null;
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const next = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(next);
    document.documentElement.dataset.theme = next;
  }, []);

  useEffect(() => {
    const storedLang = (typeof window !== "undefined" && localStorage.getItem("lang")) as "id" | "en" | null;
    if (storedLang) setLang(storedLang);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }

  function toggleLang() {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
    localStorage.setItem("lang", next);
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
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="group inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white/90 px-2 py-1 pl-1 pr-3 text-sm font-semibold text-gray-800 shadow-sm hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-orange-100 shadow-sm">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-orange-100 text-brand text-xs font-bold">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="text-left leading-tight hidden lg:block">
                      <div className="text-xs text-gray-500">{isAdmin ? "Admin" : isStudent ? "Mahasiswa" : "Pengguna"}</div>
                      <div>{currentUser.name}</div>
                    </div>
                    <span className="material-symbols-rounded text-base text-gray-500 group-hover:text-brand">expand_more</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-orange-100 bg-white/95 p-3 text-sm shadow-xl ring-1 ring-black/5"
                      >
                        <div className="flex items-center gap-3 rounded-xl bg-orange-50/70 p-3">
                          <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-orange-200">
                            {currentUser.avatarUrl ? (
                              <img src={currentUser.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-orange-100 text-brand text-xs font-bold">
                                {initials}
                              </div>
                            )}
                          </div>
                          <div className="leading-tight">
                            <div className="font-semibold text-gray-900">{currentUser.name}</div>
                            <div className="text-xs text-gray-600 truncate">{currentUser.email}</div>
                          </div>
                        </div>
                        <div className="mt-2 grid gap-1">
                          <a
                            href="/settings"
                            className="flex items-center gap-2 rounded-xl px-3 py-2 font-semibold text-gray-800 hover:bg-orange-50"
                          >
                            <span className="material-symbols-rounded text-base text-brand">settings</span>
                            Pengaturan
                          </a>
                          <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold text-gray-800 hover:bg-orange-50"
                          >
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-rounded text-base text-brand">
                                {theme === "dark" ? "dark_mode" : "light_mode"}
                              </span>
                              Mode {theme === "dark" ? "Gelap" : "Terang"}
                            </span>
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-700">
                              {theme === "dark" ? "Dark" : "Light"}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={toggleLang}
                            className="flex w-full items-center justify-between rounded-xl px-3 py-2 font-semibold text-gray-800 hover:bg-orange-50"
                          >
                            <span className="flex items-center gap-2">
                              <span className="material-symbols-rounded text-base text-brand">translate</span>
                              Bahasa
                            </span>
                            <span className="rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-700">
                              {lang === "id" ? "ID" : "EN"}
                            </span>
                          </button>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-semibold text-red-700 hover:bg-red-50"
                          >
                            <span className="material-symbols-rounded text-base">logout</span>
                            Keluar
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
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
                <div className="space-y-2 rounded-xl bg-orange-50/80 p-3 text-sm text-gray-800 ring-1 ring-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-orange-200">
                      {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-white text-brand text-xs font-bold">
                          {initials}
                        </div>
                      )}
                    </div>
                    <div className="leading-tight">
                      <div className="font-semibold">{currentUser.name}</div>
                      <div className="text-xs text-gray-600">{currentUser.email}</div>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <a
                      href="/settings"
                      className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-gray-800 ring-1 ring-orange-100 hover:ring-brand"
                    >
                      <span className="material-symbols-rounded text-base text-brand">settings</span>
                      Pengaturan
                    </a>
                    <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 font-semibold text-gray-800 ring-1 ring-orange-100">
                      <button onClick={toggleTheme} className="inline-flex items-center gap-2">
                        <span className="material-symbols-rounded text-base text-brand">
                          {theme === "dark" ? "dark_mode" : "light_mode"}
                        </span>
                        Mode {theme === "dark" ? "Gelap" : "Terang"}
                      </button>
                      <span className="text-[11px] font-semibold text-orange-700">{theme === "dark" ? "Dark" : "Light"}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 font-semibold text-gray-800 ring-1 ring-orange-100">
                      <button onClick={toggleLang} className="inline-flex items-center gap-2">
                        <span className="material-symbols-rounded text-base text-brand">translate</span>
                        Bahasa
                      </button>
                      <span className="text-[11px] font-semibold text-orange-700">{lang === "id" ? "ID" : "EN"}</span>
                    </div>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 font-semibold text-red-700 ring-1 ring-orange-100 hover:bg-red-50"
                    >
                      <span className="material-symbols-rounded text-base">logout</span>
                      Keluar
                    </button>
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

