"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

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

type Submission = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  template: Template;
};

type FormValues = Record<string, any>;

async function uploadToCloudinary(file: File) {
  const sign = await jsonFetch<{ signature: string; timestamp: number; apiKey?: string; cloudName?: string }>("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "persuratan/lampiran" }),
  });
  if (!sign.cloudName || !sign.apiKey) throw new Error("Cloudinary belum dikonfigurasi");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("folder", "persuratan/lampiran");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload gagal");
  return {
    url: data.secure_url as string,
    publicId: data.public_id as string,
    format: data.format as string,
    bytes: data.bytes as number,
    width: data.width as number,
    height: data.height as number,
    type: data.resource_type as string,
  };
}

export default function StudentDashboard({ currentUser }: { currentUser: CurrentUser }) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data: templatesData } = useQuery<{ templates: Template[] }>({ queryKey: ["templates"], queryFn: () => jsonFetch("/api/forms/templates") });
  const { data: submissionsData, isFetching } = useQuery<{ submissions: Submission[] }>({
    queryKey: ["submissions"],
    queryFn: () => jsonFetch("/api/forms/submissions"),
  });

  const templates = templatesData?.templates || [];
  const submissions = submissionsData?.submissions || [];

  const pendingCount = useMemo(() => submissions.filter((s) => s.status === "IN_REVIEW" || s.status === "DRAFT").length, [submissions]);
  const approvedCount = useMemo(() => submissions.filter((s) => s.status === "APPROVED" || s.status === "SENT").length, [submissions]);
  const rejectedCount = useMemo(() => submissions.filter((s) => s.status === "REJECTED" || s.status === "CANCELLED").length, [submissions]);
  const submissionsByTemplate = useMemo(
    () =>
      submissions.reduce<Record<string, number>>((acc, s) => {
        acc[s.template.id] = (acc[s.template.id] || 0) + 1;
        return acc;
      }, {}),
    [submissions]
  );

  useEffect(() => {
    if (!selectedTemplateId && templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [templates, selectedTemplateId]);

  const activeTemplate = useMemo(() => templates.find((t) => t.id === selectedTemplateId) || null, [templates, selectedTemplateId]);
  const form = useForm<FormValues>({});

  useEffect(() => {
    form.reset({});
    setAttachments([]);
  }, [activeTemplate]);

  const submissionMutation = useMutation({
    mutationFn: (payload: any) =>
      jsonFetch("/api/forms/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      setMessage("Surat terkirim. Anda akan mendapat pembaruan via email.");
      setError(null);
      form.reset({});
      setAttachments([]);
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (err: any) => {
      setMessage(null);
      setError(err.message || "Gagal mengirim surat");
    },
  });

  async function handleFileChange(fieldId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    try {
      const uploads = [] as any[];
      for (const file of Array.from(files)) {
        const up = await uploadToCloudinary(file);
        uploads.push(up);
      }
      setAttachments((prev) => [...prev, ...uploads]);
      form.setValue(fieldId, uploads.map((u) => u.url));
    } catch (err: any) {
      setError(err.message || "Upload gagal");
    }
  }

  function onSubmit(values: FormValues) {
    if (!activeTemplate) return;
    const payload = {
      templateId: activeTemplate.id,
      title: activeTemplate.title,
      payload: values,
      attachments,
    };
    submissionMutation.mutate(payload);
  }

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
              Pilih jenis surat seperti pada menu awal, isi form dinamis, unggah lampiran, dan pantau status dalam satu tempat.
            </p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-orange-200">
                <span className="material-symbols-rounded text-base text-brand">person</span>
                {currentUser.name}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 font-semibold text-gray-800 ring-1 ring-orange-200">
                <span className="material-symbols-rounded text-base text-brand">mail</span>
                {currentUser.email}
              </span>
            </div>
          </div>
          <div className="grid w-full max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
            <DashboardStat label="Menunggu" value={pendingCount} icon="pending_actions" tone="amber" />
            <DashboardStat label="Disetujui/Terkirim" value={approvedCount} icon="task_alt" tone="emerald" />
            <DashboardStat label="Ditolak/Batal" value={rejectedCount} icon="block" tone="rose" />
          </div>
        </div>
        {message && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Pilih Surat Permohonan</p>
              <h2 className="text-xl font-semibold text-gray-900">Seperti menu awal, pilih kartu layanan</h2>
              <p className="text-sm text-gray-700">Klik kartu untuk memilih template. Pilihan aktif ditandai dengan ring.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-gray-700 ring-1 ring-orange-200">
              <span className="material-symbols-rounded text-brand text-base">check_circle</span>
              {templates.length} template tersedia
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {templates.map((t) => {
              const active = t.id === selectedTemplateId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTemplateId(t.id)}
                  className={`group relative w-full rounded-2xl border bg-white/90 p-4 text-left shadow-sm transition-all duration-150 ${
                    active
                      ? "border-brand ring-2 ring-brand/50"
                      : "border-orange-100 hover:-translate-y-1 hover:border-brand/60 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`grid h-11 w-11 place-items-center rounded-xl text-sm font-semibold uppercase ${
                        active ? "bg-brand text-white shadow-inner" : "bg-orange-50 text-brand ring-1 ring-orange-200"
                      }`}
                    >
                      {t.title.slice(0, 2)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{t.title}</p>
                        {active && (
                          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold uppercase text-brand">
                            aktif
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 max-h-10 overflow-hidden text-ellipsis">
                        {t.description || "Form permohonan mahasiswa"}
                      </p>
                      <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700">
                        <span className="material-symbols-rounded text-sm text-brand">history</span>
                        {submissionsByTemplate[t.id] || 0} riwayat
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
            {templates.length === 0 && (
              <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 text-sm text-gray-700">
                Template belum tersedia.
              </div>
            )}
          </div>
        </section>

        <section className="card space-y-4 bg-white/95 p-5 shadow-lg ring-1 ring-orange-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Form Permohonan</p>
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTemplate ? activeTemplate.title : "Pilih template untuk memulai"}
              </h3>
              {activeTemplate?.description && <p className="text-sm text-gray-700">{activeTemplate.description}</p>}
            </div>
            <div className="grid place-items-center rounded-xl bg-orange-50 px-3 py-2 text-brand ring-1 ring-orange-200">
              <span className="material-symbols-rounded">dynamic_form</span>
            </div>
          </div>

          {activeTemplate ? (
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {activeTemplate.schema.map((field) => {
                const required = !!field.required;
                if (field.type === "textarea") {
                  return (
                    <div key={field.id} className="grid gap-1.5">
                      <label className="text-sm font-semibold text-gray-900">
                        {field.label} {required && <span className="text-red-600">*</span>}
                      </label>
                      <textarea
                        {...form.register(field.id, { required })}
                        placeholder={field.placeholder}
                        rows={4}
                        className="rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                      {field.helperText && <p className="text-xs text-gray-600">{field.helperText}</p>}
                    </div>
                  );
                }
                if (field.type === "select") {
                  return (
                    <div key={field.id} className="grid gap-1.5">
                      <label className="text-sm font-semibold text-gray-900">
                        {field.label} {required && <span className="text-red-600">*</span>}
                      </label>
                      <select
                        {...form.register(field.id, { required })}
                        className="rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Pilih opsi
                        </option>
                        {(field.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {field.helperText && <p className="text-xs text-gray-600">{field.helperText}</p>}
                    </div>
                  );
                }
                if (field.type === "file") {
                  return (
                    <div key={field.id} className="grid gap-1.5">
                      <label className="text-sm font-semibold text-gray-900">
                        {field.label} {required && <span className="text-red-600">*</span>}
                      </label>
                      <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(field.id, e.target.files)}
                          className="w-full text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-none file:bg-brand file:px-4 file:py-2 file:text-white hover:border-brand/70 focus:outline-none"
                        />
                        {field.helperText && <p className="mt-1 text-xs text-gray-600">{field.helperText}</p>}
                        {attachments.length > 0 && (
                          <ul className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700">
                            {attachments.map((att, idx) => (
                              <li
                                key={`${att.publicId}-${idx}`}
                                className="rounded-full bg-white px-3 py-1 ring-1 ring-orange-200"
                              >
                                {att.publicId}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={field.id} className="grid gap-1.5">
                    <label className="text-sm font-semibold text-gray-900">
                      {field.label} {required && <span className="text-red-600">*</span>}
                    </label>
                    <input
                      type={field.type === "date" ? "date" : "text"}
                      {...form.register(field.id, { required })}
                      placeholder={field.placeholder}
                      className="rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    {field.helperText && <p className="text-xs text-gray-600">{field.helperText}</p>}
                  </div>
                );
              })}

              <button type="submit" className="btn btn-primary btn-full shadow-md shadow-orange-200/60" disabled={submissionMutation.isPending}>
                {submissionMutation.isPending ? "Mengirim..." : "Kirim Surat"}
              </button>
            </form>
          ) : (
            <p className="text-sm text-gray-700">Pilih template pada daftar kartu untuk mulai mengisi form.</p>
          )}
        </section>
      </div>

      <section className="card space-y-4 bg-white/95 p-5 shadow-md ring-1 ring-orange-100">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-brand text-xl">inbox</span>
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Surat</h2>
          </div>
          <p className="text-xs text-gray-600">Riwayat terbaru tampil di atas.</p>
        </div>
        <div className="space-y-3">
          {submissions.map((s) => (
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
              <a
                href={`/api/forms/submissions/${s.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand-600"
              >
                <span className="material-symbols-rounded text-sm">picture_as_pdf</span>
                Lihat PDF
              </a>
            </div>
          ))}
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
