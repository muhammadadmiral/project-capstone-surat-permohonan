"use client";

import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

type FormLayoutProps = PropsWithChildren<{
  title: string;
  description: string;
}>;

export default function FormLayout({ title, description, children }: FormLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white">
      <div className="mx-auto max-w-3xl w-full px-4 py-12 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-600"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19 8 12l7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Beranda
        </Link>

        <div className="rounded-2xl bg-white/95 p-6 md:p-8 shadow-xl ring-1 ring-black/5">
          <div className="flex flex-col gap-3 rounded-xl border border-orange-100 bg-orange-50/70 p-4 md:flex-row md:items-center md:gap-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-orange-200 bg-white shadow-sm">
              <Image src="/images/logo-upnvj.png" alt="Logo UPN Veteran Jakarta" fill className="object-contain p-1.5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">Formulir Persuratan</p>
              <div className="text-sm font-semibold text-gray-900">Fakultas Ilmu Komputer - UPN Veteran Jakarta</div>
              <p className="text-xs text-orange-900/80">Lengkapi data berikut dengan benar untuk mempercepat verifikasi.</p>
            </div>
          </div>

          <header className="space-y-2 mt-6 mb-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600">{description}</p>
          </header>

          <div className="space-y-5">{children}</div>
        </div>
      </div>
    </main>
  );
}
