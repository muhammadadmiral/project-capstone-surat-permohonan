"use client";

import { motion } from "framer-motion";

const faqs = [
  {
    q: "Berapa lama proses penerbitan surat?",
    a: "Waktu proses bervariasi tergantung jenis layanan. Rata-rata 2-5 hari kerja.",
  },
  {
    q: "Apakah harus menggunakan email kampus?",
    a: "Disarankan menggunakan email kampus untuk memudahkan verifikasi dan pengiriman berkas.",
  },
  {
    q: "Jika ada kendala, ke mana harus menghubungi?",
    a: "Silakan hubungi admin melalui kontak yang tersedia pada bagian footer atau email fik@upnvj.ac.id.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="card p-6 md:p-8 scroll-mt-24">
      <h3 className="text-lg md:text-xl font-semibold text-gray-900">Pertanyaan Umum</h3>
      <div className="mt-4 divide-y divide-orange-100">
        {faqs.map((item, idx) => (
          <motion.details
            key={item.q}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: idx * 0.03 }}
            className="group py-3"
          >
            <summary className="flex cursor-pointer items-center justify-between text-gray-900 font-medium list-none">
              {item.q}
              <span className="ml-4 grid h-7 w-7 place-items-center rounded-md bg-orange-50 text-brand ring-1 ring-orange-200 transition-transform duration-200 group-open:rotate-180">
                <span className="material-symbols-rounded text-base">expand_more</span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.a}</p>
          </motion.details>
        ))}
      </div>
    </section>
  );
}
