"use client";

import { useMemo, useState } from "react";
import { formLinks } from "@/data/formLinks";
import FormLinksGrid from "./FormLinksGrid";
import { motion } from "framer-motion";

export default function ServicesSection() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return formLinks;
    const term = q.toLowerCase();
    return formLinks.filter((l) => l.label.toLowerCase().includes(term));
  }, [q]);

  return (
    <section className="space-y-3 scroll-mt-24" id="layanan">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Pilih Layanan</h2>
          <p className="text-sm text-gray-600">Silakan pilih layanan yang Anda butuhkan.</p>
        </div>

        <label className="relative w-full md:w-80">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari layanan..."
            className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 outline-none ring-brand/20 focus:ring-2"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-rounded text-lg">search</span>
          </span>
        </label>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-xs text-gray-500"
      >
        Menampilkan {filtered.length} dari {formLinks.length} layanan
      </motion.p>

      {filtered.length > 0 ? (
        <FormLinksGrid links={filtered} />
      ) : (
        <div className="card p-6 text-sm text-gray-600">Tidak ada layanan yang cocok.</div>
      )}
    </section>
  );
}

