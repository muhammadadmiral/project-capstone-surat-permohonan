"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-orange-100"
    >
      <div className="mx-auto max-w-6xl w-full px-4">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <BrandMark />
            <div className="leading-tight">
              <div className="font-semibold text-gray-900">FIK UPN Veteran Jakarta</div>
              <div className="text-xs text-gray-600">Layanan Persuratan</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1.5">
            <a href="#mulai" className="nav-link">Mulai</a>
            <a href="#layanan" className="nav-link">Layanan</a>
            <a href="#faq" className="nav-link">FAQ</a>
            <a href="#kontak" className="nav-link">Kontak</a>
            <a href="/dashboard" className="nav-link">Dashboard</a>
            <a href="/login" className="nav-link">Admin</a>
            <a href="/settings" className="nav-link inline-flex items-center gap-1">
              <span className="material-symbols-rounded text-base">account_circle</span>
              Settings
            </a>
          </nav>
        </div>
      </div>
      <div className="h-0.5 bg-gradient-to-r from-brand/80 via-brand to-brand/80 opacity-70" />
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

