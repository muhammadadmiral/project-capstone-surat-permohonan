"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Permintaan gagal");
  return data;
}

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MAHASISWA";
};

type TemplateField = {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  helperText?: string;
};

type Template = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  schema: TemplateField[];
};

type SubmissionAttachment = {
  id: string;
  url: string;
  publicId: string;
  format?: string | null;
  bytes?: number | null;
  width?: number | null;
  height?: number | null;
  type?: string | null;
};

type Submission = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  payload: Record<string, any>;
  template: Template;
  attachments: SubmissionAttachment[];
};

export default function StudentDashboard({ currentUser }: { currentUser: CurrentUser }) {
  const [expandedSubmissionId, setExpandedSubmissionId] = useState<string | null>(null);

  const { data: templatesData } = useQuery<{ templates: Template[] }>({
    queryKey: ["templates"],
    queryFn: () => jsonFetch("/api/forms/templates"),
  });
  const { data: submissionsData, isFetching } = useQuery<{ submissions: Submission[] }>({
    queryKey: ["submissions"],
    queryFn: () => jsonFetch("/api/forms/submissions"),
  });

  const templates = templatesData?.templates || [];
  const submissions = submissionsData?.submissions || [];

  const pendingCount = useMemo(
    () => submissions.filter((s) => s.status === "IN_REVIEW" || s.status === "DRAFT").length,
    [submissions]
  );
  const approvedCount = useMemo(
    () => submissions.filter((s) => s.status === "APPROVED" || s.status === "SENT").length,
    [submissions]
  );
  const rejectedCount = useMemo(
    () => submissions.filter((s) => s.status === "REJECTED" || s.status === "CANCELLED").length,
    [submissions]
  );
  const submissionsByTemplate = useMemo(
    () =>
      submissions.reduce<Record<string, number>>((acc, s) => {
        acc[s.template.id] = (acc[s.template.id] || 0) + 1;
        return acc;
      }, {}),
    [submissions]
  );

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-50 via-white to-amber-50 p-6 md:p-8 ring-1 ring-orange-100 shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-700">Dashboard Mahasiswa</p>
            <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
              Kirim permohonan surat dengan tampilan yang lebih jelas dan terstruktur
            </h1>
            <p className="text-sm text-gray-700">
              Pilih jenis surat, baca detailnya, isi form, unggah lampiran, lalu pantau status di satu tempat.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-orange-200">
                <span className="material-symbols-rounded text-base text-brand">person</span>
                <span className="min-w-0 break-words">{currentUser.name}</span>
              </span>
              <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-orange-200">
                <span className="material-symbols-rounded text-base text-brand">mail</span>
                <span className="min-w-0 break-all">{currentUser.email}</span>
              </span>
            </div>
          </div>
          <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            <DashboardStat label="Menunggu" value={pendingCount} icon="pending_actions" tone="amber" />
            <DashboardStat label="Disetujui/Terkirim" value={approvedCount} icon="task_alt" tone="emerald" />
            <DashboardStat label="Ditolak/Batal" value={rejectedCount} icon="block" tone="rose" />
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Pilih Surat Permohonan</p>
            <h2 className="text-xl font-semibold text-gray-900">Klik kartu untuk membuka detail form</h2>
            <p className="text-sm text-gray-700">Anda akan diarahkan ke halaman detail form untuk mengisi data.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-orange-200">
            <span className="material-symbols-rounded text-brand text-base">check_circle</span>
            {templates.length} template tersedia
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/dashboard/forms/${t.slug || t.id}`}
              className="group relative w-full rounded-2xl border border-orange-100 bg-white/90 p-4 text-left shadow-sm transition-all duration-150 hover:-translate-y-1 hover:border-brand/60 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-orange-50 text-brand ring-1 ring-orange-200 text-sm font-semibold uppercase">
                  {t.title.slice(0, 2)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{t.title}</p>
                  <p className="text-xs text-gray-600 max-h-10 overflow-hidden text-ellipsis">
                    {t.description || "Form permohonan mahasiswa"}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700">
                    <span className="material-symbols-rounded text-sm text-brand">history</span>
                    {submissionsByTemplate[t.id] || 0} riwayat
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {templates.length === 0 && (
            <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 text-sm text-gray-700">
              Template belum tersedia.
            </div>
          )}
        </div>
      </section>

      <section className="card space-y-4 bg-white/95 p-5 shadow-md ring-1 ring-orange-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-brand text-xl">inbox</span>
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Surat</h2>
          </div>
          <p className="text-xs text-gray-600">Riwayat terbaru tampil di atas.</p>
        </div>
        <div className="space-y-3">
          {submissions.map((s) => {
            const isOpen = expandedSubmissionId === s.id;
            const schema = Array.isArray(s.template?.schema) ? s.template.schema : [];
            const payload = s.payload || {};
            const knownKeys = new Set(schema.map((field) => field.id));
            const extraKeys = Object.keys(payload).filter((key) => !knownKeys.has(key));

            return (
              <div
                key={s.id}
                className="rounded-2xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm transition hover:-translate-y-[2px] hover:shadow-md"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{s.title}</div>
                    <div className="text-xs text-gray-600">Template: {s.template.title}</div>
                    <div className="text-xs text-gray-600">Dikirim: {new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setExpandedSubmissionId(isOpen ? null : s.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-brand"
                  >
                    <span className="material-symbols-rounded text-sm">{isOpen ? "expand_less" : "expand_more"}</span>
                    {isOpen ? "Tutup detail" : "Lihat detail"}
                  </button>
                  <a
                    href={`/api/forms/submissions/${s.id}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-600"
                  >
                    <span className="material-symbols-rounded text-sm">picture_as_pdf</span>
                    Lihat PDF
                  </a>
                </div>

                {isOpen && (
                  <div className="mt-3 rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-xs text-gray-700">
                    <div className="grid gap-2">
                      {schema.map((field) => (
                        <div key={field.id} className="grid gap-1 sm:grid-cols-[180px,1fr]">
                          <div className="text-gray-600">{field.label}</div>
                          <div className="font-semibold text-gray-900">{renderSubmissionValue(payload[field.id])}</div>
                        </div>
                      ))}
                      {extraKeys.map((key) => (
                        <div key={key} className="grid gap-1 sm:grid-cols-[180px,1fr]">
                          <div className="text-gray-600">{key}</div>
                          <div className="font-semibold text-gray-900">{renderSubmissionValue(payload[key])}</div>
                        </div>
                      ))}
                      {schema.length === 0 && extraKeys.length === 0 && (
                        <div className="text-gray-600">Detail form belum tersedia.</div>
                      )}
                    </div>
                    {s.attachments?.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs font-semibold text-gray-700">Lampiran</div>
                        <ul className="mt-1 flex flex-wrap gap-2">
                          {s.attachments.map((att) => (
                            <li key={att.id}>
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex max-w-full items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand ring-1 ring-orange-200 hover:text-brand-600 break-all text-left"
                              >
                                <span className="material-symbols-rounded text-sm">attach_file</span>
                                {att.publicId || "Lampiran"}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {submissions.length === 0 && !isFetching && <p className="text-sm text-gray-700">Belum ada surat.</p>}
        </div>
      </section>
    </div>
  );
}

function DashboardStat({ label, value, icon, tone }: { label: string; value: number; icon: string; tone: "amber" | "emerald" | "rose" }) {
  const toneClasses =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "rose"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <div className={`rounded-2xl ${toneClasses} p-3 ring-1 shadow-inner`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        <span className="material-symbols-rounded text-base">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold leading-tight">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "APPROVED" || status === "SENT"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : status === "REJECTED" || status === "CANCELLED"
        ? "bg-rose-50 text-rose-700 ring-rose-200"
        : "bg-amber-50 text-amber-800 ring-amber-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ${tone}`}>
      <span className="material-symbols-rounded text-sm">circle</span>
      {status}
    </span>
  );
}

function isLikelyUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function renderSubmissionValue(value: unknown) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-500">-</span>;
    return (
      <ul className="flex flex-wrap gap-2">
        {value.map((item, idx) => {
          const text = String(item);
          return (
            <li key={`${text}-${idx}`}>
              {isLikelyUrl(text) ? (
                <a
                  href={text}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex max-w-full items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-brand ring-1 ring-orange-200 break-all text-left"
                >
                  <span className="material-symbols-rounded text-sm">attach_file</span>
                  {text}
                </a>
              ) : (
                <span className="max-w-full break-all rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-gray-700 ring-1 ring-orange-200">
                  {text}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-500">-</span>;
  }

  if (typeof value === "object") {
    return <span className="text-gray-700">{JSON.stringify(value)}</span>;
  }

  return <span className="text-gray-700">{String(value)}</span>;
}
