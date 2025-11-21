"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Isi Data",
    desc: "Masukkan data dasar dan pilih layanan yang dibutuhkan.",
  },
  {
    title: "Proses Verifikasi",
    desc: "Admin memeriksa kelengkapan berkas dan keabsahan data.",
  },
  {
    title: "Terima Dokumen",
    desc: "Dokumen diterbitkan sesuai ketentuan dan diinformasikan ke email Anda.",
  },
];

export default function Steps() {
  return (
    <section className="card p-6 md:p-8">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900">Alur Layanan</h3>
      <motion.ol
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="mt-5 grid gap-4 md:grid-cols-3"
      >
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            className="flex items-start gap-4"
          >
            <div className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-orange-100 text-brand font-semibold ring-1 ring-orange-200">
              {i + 1}
            </div>
            <div>
              <div className="font-medium text-gray-900">{s.title}</div>
              <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}

