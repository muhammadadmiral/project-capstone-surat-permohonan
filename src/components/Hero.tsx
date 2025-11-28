"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const { scrollYProgress } = useScroll();
  const floatY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const floatX = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const stats = [
    { label: "Respons awal", value: "< 1 hari kerja", icon: "bolt" },
  { label: "Estimasi selesai", value: "2-7 hari kerja", icon: "schedule" },
    { label: "Layanan aktif", value: "10 formulir", icon: "approval" },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/90 p-8 md:p-12 ring-1 ring-black/5 shadow-xl">
      <div className="pointer-events-none absolute inset-0 opacity-60 academic-pattern" aria-hidden />

      <div className="absolute -left-10 -top-10 h-52 w-52 rounded-full bg-orange-100 blur-3xl opacity-70" />
      <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-orange-200/60 blur-3xl opacity-60" />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-orange-800 shadow-sm"
          >
            <span className="material-symbols-rounded text-brand text-base">workspace_premium</span>
            Portal resmi FIK UPN Veteran Jakarta
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight"
          >
            Layanan Persuratan Akademis
            <span className="block text-brand">TODO : HERO</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-2 text-gray-600 md:text-lg"
          >
            Ajukan permohonan surat akademik, beasiswa, hingga MBKM dengan sentuhan visual yang progresif
            dan tetap formal.
          </motion.p>

          <div className="grid gap-3 sm:grid-cols-2">
            <a href="#mulai" className="btn btn-primary">
              Mulai Permohonan
            </a>
            <a href="#layanan" className="btn btn-outline">
              Lihat Layanan
            </a>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-3 sm:grid-cols-3"
          >
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-orange-100 bg-white/90 p-3 shadow-sm ring-1 ring-white/60"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-orange-700">
                  <span className="material-symbols-rounded text-sm">{item.icon}</span>
                  {item.label}
                </div>
                <div className="text-lg font-semibold text-gray-900">{item.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
          <motion.div
            className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white via-orange-50 to-white shadow-2xl ring-1 ring-orange-100"
            style={{ y: floatY, x: floatX }}
          />

          <motion.div
            className="absolute inset-3 rounded-[24px] bg-white/90 backdrop-blur"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -30]) }}
          >
            {/* TODO: Ganti backgroundImage dengan ilustrasi kampus futuristik atau foto gedung FIK */}
            <div
              className="h-full w-full rounded-[24px] bg-gradient-to-br from-orange-50 via-white to-orange-100"
              style={{
                backgroundImage: "url('/images/hero-campus-illustration.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </motion.div>

          <motion.div
            className="absolute left-4 top-4 rounded-2xl bg-white/90 px-4 py-3 shadow-lg ring-1 ring-orange-100"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -20]) }}
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
              <span className="material-symbols-rounded text-brand">verified</span>
              Terverifikasi Admin
            </div>
            <p className="text-xs text-gray-600 mt-1">Tim akademik memproses sesuai SOP fakultas.</p>
          </motion.div>

          <motion.div
            className="absolute right-2 bottom-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-lg ring-1 ring-orange-100"
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 24]) }}
          >
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
              <img src="/images/logo-upnvj.png" alt="Logo UPNVJ" className="h-full w-full object-contain p-2" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-orange-700">Identitas FIK</div>
              <div className="text-sm font-semibold text-gray-900">UPN Veteran Jakarta</div>
              <p className="text-[11px] text-gray-500">Integritas | Profesionalisme | Kolaborasi</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute -left-6 bottom-10 h-20 w-20 rounded-full bg-orange-200/70 blur-2xl"
            style={{ x: useTransform(scrollYProgress, [0, 1], [-10, 18]) }}
          />
          <motion.div
            className="absolute -right-4 top-6 h-16 w-16 rounded-full bg-orange-300/60 blur-2xl"
            style={{ x: useTransform(scrollYProgress, [0, 1], [10, -12]) }}
          />
        </div>
      </div>
    </section>
  );
}
