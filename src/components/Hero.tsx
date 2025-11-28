"use client";

import { motion } from "framer-motion";

const highlights = [
  { label: "Pantau estimasi & status real-time", icon: "schedule" },
  { label: "Notifikasi langsung ke email kampus", icon: "mail" },
  { label: "SOP terintegrasi dengan admin FIK", icon: "workspace_premium" },
];

const stats = [
  { label: "Respons awal", value: "< 1 hari kerja", icon: "bolt" },
  { label: "Dokumen selesai", value: "2-5 hari kerja", icon: "task_alt" },
  { label: "Layanan aktif", value: "10 layanan", icon: "widgets" },
];

const checkpoints = [
  {
    title: "Pengajuan diterima",
    desc: "Cek email kampus untuk nomor tiket & panduan berkas.",
    icon: "mark_email_read",
    time: "09:15 WIB",
  },
  {
    title: "Verifikasi admin",
    desc: "Berkas sedang dicek. Pastikan unggahan jelas & lengkap.",
    icon: "shield_person",
    time: "Sedang berlangsung",
  },
  {
    title: "Terbit & arsip",
    desc: "File PDF dikirim ke email kampus & arsip fakultas.",
    icon: "draft",
    time: "Menunggu",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#fff8f1] to-white p-8 md:p-12 ring-1 ring-orange-100/80 shadow-2xl">
      <div className="pointer-events-none absolute inset-0 opacity-70 academic-pattern" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_15%_-10%,rgba(255,140,0,0.14),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(720px_320px_at_85%_8%,rgba(255,140,0,0.12),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(120deg, rgba(255,140,0,0.07) 0%, transparent 28%, rgba(255,140,0,0.06) 62%, transparent 100%)",
        }}
      />

      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/85 px-4 py-3 text-sm shadow-sm backdrop-blur"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 ring-1 ring-orange-100">
              <img
                src="/images/logo-upnvj.png"
                alt="Logo UPN Veteran Jakarta"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-orange-700">
                Portal Persuratan
              </div>
              <div className="text-sm font-semibold text-gray-900">Fakultas Ilmu Komputer UPNVJ</div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight"
          >
            Pusat Permohonan Surat Akademik
            <span className="block text-brand">UPN Veteran Jakarta</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="mt-2 text-gray-600 md:text-lg leading-relaxed"
          >
            Ajukan surat akademik, rekomendasi, hingga MBKM lewat satu pintu. Proses transparan, terverifikasi,
            dan selalu terhubung dengan email kampus Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-wrap items-center gap-2.5"
          >
            {highlights.map((item) => (
              <span
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-medium text-gray-800 shadow-sm ring-1 ring-orange-100"
              >
                <span className="material-symbols-rounded text-brand text-sm">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="flex flex-wrap items-center gap-3 text-sm text-gray-700"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-orange-100">
              <span className="material-symbols-rounded text-brand text-base">verified</span>
              Terhubung langsung dengan admin fakultas
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-2 text-orange-800 ring-1 ring-orange-100">
              <span className="material-symbols-rounded text-base">notifications_active</span>
              Notifikasi status via email kampus
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="grid gap-3 sm:grid-cols-2">
              <a href="#mulai" className="btn btn-primary">
                <span className="material-symbols-rounded text-base">play_arrow</span>
                Mulai Permohonan
              </a>
              <a href="#layanan" className="btn btn-outline">
                <span className="material-symbols-rounded text-base">list_alt</span>
                Lihat Layanan
              </a>
            </div>
            <a
              href="#faq"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm font-semibold text-orange-800 shadow-sm hover:bg-orange-50"
            >
              <span className="material-symbols-rounded text-base text-brand">help</span>
              FAQ & SOP
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
                className="relative overflow-hidden rounded-2xl border border-orange-100 bg-white/92 p-3 shadow-sm ring-1 ring-white/60"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-50/70 via-transparent to-orange-100/60" />
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-orange-700">
                  <span className="material-symbols-rounded text-sm">{item.icon}</span>
                  {item.label}
                </div>
                <div className="text-lg font-semibold text-gray-900">{item.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[28px] border border-orange-100 bg-white/90 p-6 shadow-2xl ring-1 ring-orange-100/70 backdrop-blur"
        >
          <div className="absolute inset-x-6 top-6 h-32 rounded-3xl bg-gradient-to-br from-orange-50/90 via-white to-orange-100/70 blur-3xl" aria-hidden />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-orange-700">Dashboard Singkat</div>
              <div className="text-lg font-semibold text-gray-900">Antrian Layanan Hari Ini</div>
              <p className="text-sm text-gray-600 mt-1">
                Status terbaru yang akan muncul di email kampus Anda.
              </p>
            </div>
            <span className="material-symbols-rounded text-brand bg-orange-50 ring-1 ring-orange-100 rounded-xl p-2">
              radar
            </span>
          </div>

          <div className="mt-4 grid gap-3">
            <div className="flex items-center justify-between rounded-2xl bg-orange-50/90 px-4 py-3 text-sm font-semibold text-orange-900 ring-1 ring-orange-200">
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-base">stack</span>
                Antrian aktif
              </div>
              <span className="text-lg">24</span>
            </div>

            <div className="grid gap-3">
              {checkpoints.map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-2xl border border-orange-100 bg-white/95 px-4 py-3 shadow-sm"
                >
                  <span className="mt-1 grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-brand ring-1 ring-orange-200">
                    <span className="material-symbols-rounded text-[20px]">{item.icon}</span>
                  </span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-gray-900">{item.title}</div>
                      <div className="text-xs text-orange-700">{item.time}</div>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-orange-100 bg-white/95 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-brand text-base">shield_person</span>
                    Verifikasi admin
                  </div>
                  <span className="text-xs text-orange-700">75%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-orange-100">
                  <div className="h-full w-[75%] rounded-full bg-orange-500" />
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  Pastikan identitas & berkas pendukung sudah benar.
                </p>
              </div>
              <div className="rounded-2xl border border-orange-100 bg-white/95 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-rounded text-brand text-base">event_available</span>
                    Target terbit
                  </div>
                  <span className="text-xs text-orange-700">2-5 hari</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-orange-100">
                  <div className="h-full w-[60%] rounded-full bg-orange-400" />
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  Dokumen digital + arsip fakultas akan dikirim bersamaan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/90 px-4 py-3 text-sm text-gray-800 shadow-sm">
              <span className="material-symbols-rounded text-brand text-base">mail</span>
              Gunakan email kampus aktif agar pembaruan status dan file PDF tidak terblokir.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
