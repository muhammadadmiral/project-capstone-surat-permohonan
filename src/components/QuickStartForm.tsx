"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formLinks } from "@/data/formLinks";
import { motion } from "framer-motion";

type FormState = {
  nama: string;
  nim: string;
  email: string;
  layanan: string; // href
};

const initialState: FormState = {
  nama: "",
  nim: "",
  email: "",
  layanan: formLinks[0]?.href ?? "",
};

export default function QuickStartForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const valid = useMemo(() => {
    const emailOk = /.+@.+\..+/.test(state.email);
    return (
      state.nama.trim().length > 1 &&
      state.nim.trim().length >= 5 &&
      emailOk &&
      state.layanan
    );
  }, [state]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function onBlur<K extends keyof FormState>(key: K) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const params = new URLSearchParams({
      nama: state.nama,
      nim: state.nim,
      email: state.email,
    }).toString();
    router.push(`${state.layanan}?${params}`);
  }

  return (
    <motion.section
      id="mulai"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5 }}
      className="card p-6 md:p-8 scroll-mt-24"
    >
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
        Mulai Permohonan Cepat
      </h2>
      <p className="mt-1 text-sm text-gray-600">
        Isi data dasar Anda, lalu pilih layanan untuk melanjutkan.
      </p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="grid gap-1.5">
          <label htmlFor="nama" className="text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            id="nama"
            name="nama"
            value={state.nama}
            onChange={(e) => onChange("nama", e.target.value)}
            onBlur={() => onBlur("nama")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none ring-brand/20 focus:ring-2"
            placeholder="Nama sesuai KTP"
            required
          />
          {touched.nama && state.nama.trim().length <= 1 && (
            <p className="text-xs text-red-600">Mohon isi nama dengan benar.</p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="nim" className="text-sm font-medium text-gray-700">
            NIM
          </label>
          <input
            id="nim"
            name="nim"
            value={state.nim}
            onChange={(e) => onChange("nim", e.target.value)}
            onBlur={() => onBlur("nim")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none ring-brand/20 focus:ring-2"
            placeholder="Contoh: 123456789"
            required
          />
          {touched.nim && state.nim.trim().length < 5 && (
            <p className="text-xs text-red-600">NIM tidak valid.</p>
          )}
        </div>

        <div className="grid gap-1.5 md:col-span-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Aktif
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={state.email}
            onChange={(e) => onChange("email", e.target.value)}
            onBlur={() => onBlur("email")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none ring-brand/20 focus:ring-2"
            placeholder="nama@upnvj.ac.id"
            required
          />
          {touched.email && !/.+@.+\..+/.test(state.email) && (
            <p className="text-xs text-red-600">Email tidak valid.</p>
          )}
        </div>

        <div className="grid gap-1.5 md:col-span-2">
          <label htmlFor="layanan" className="text-sm font-medium text-gray-700">
            Jenis Layanan
          </label>
          <select
            id="layanan"
            name="layanan"
            value={state.layanan}
            onChange={(e) => onChange("layanan", e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 outline-none ring-brand/20 focus:ring-2"
          >
            {formLinks.map((l) => (
              <option key={l.href} value={l.href}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 mt-2">
          <button
            type="submit"
            disabled={!valid}
            className="btn btn-primary btn-full"
          >
            Lanjutkan
          </button>
        </div>
      </form>
    </motion.section>
  );
}
