"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/70 p-8 md:p-12 ring-1 ring-black/5 shadow-sm">
      <div className="pointer-events-none absolute inset-0 opacity-60 academic-pattern" aria-hidden />

      <div className="relative z-10 grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight"
          >
            Layanan Persuratan Fakultas Ilmu Komputer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-gray-600 md:text-lg"
          >
            UPN Veteran Jakarta
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <a
              href="#mulai"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-white shadow-md hover:bg-brand-600 transition-colors"
            >
              Mulai Permohonan
            </a>
            <a
              href="#layanan"
              className="inline-flex items-center justify-center rounded-xl border border-orange-200 bg-white px-5 py-3 text-brand hover:bg-orange-50 transition-colors"
            >
              Lihat Layanan
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto aspect-[4/3] w-full max-w-md"
        >
          <AcademicBadge />
        </motion.div>
      </div>
    </section>
  );
}

function AcademicBadge() {
  return (
    <div className="card grid place-items-center p-8 md:p-10">
      <svg
        viewBox="0 0 200 200"
        className="h-40 w-40 text-brand"
        role="img"
        aria-label="Lambang Akademik"
      >
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#g)" opacity="0.12" />
        <path
          d="M100 45l65 25-65 25-65-25 65-25Zm-40 45v30c0 5 5 10 15 14 20 8 50 8 70 0 10-4 15-9 15-14V90"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M70 125c20 8 50 8 70 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-4 text-center text-sm text-gray-600">
        Integritas • Profesionalisme • Kolaborasi
      </p>
    </div>
  );
}

