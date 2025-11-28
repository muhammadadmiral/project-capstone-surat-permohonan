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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Dashboard Mahasiswa</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Kirim Permohonan Surat</h1>
        <p className="text-sm text-gray-600">Pilih template, isi form dinamis, unggah lampiran, dan pantau status.</p>
      </div>

      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

      <div className="card p-5 md:p-6 space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1">
            <label className="text-sm font-semibold text-gray-900">Template</label>
            <select
              value={selectedTemplateId || ""}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            {activeTemplate?.description && <p className="text-xs text-gray-600">{activeTemplate.description}</p>}
          </div>
        </div>

        {activeTemplate ? (
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {activeTemplate.schema.map((field) => {
              const required = !!field.required;
              if (field.type === "textarea") {
                return (
                  <div key={field.id} className="grid gap-1">
                    <label className="text-sm font-medium text-gray-800">
                      {field.label} {required && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                      {...form.register(field.id, { required })}
                      placeholder={field.placeholder}
                      rows={4}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                    />
                    {field.helperText && <p className="text-xs text-gray-500">{field.helperText}</p>}
                  </div>
                );
              }
              if (field.type === "select") {
                return (
                  <div key={field.id} className="grid gap-1">
                    <label className="text-sm font-medium text-gray-800">
                      {field.label} {required && <span className="text-red-600">*</span>}
                    </label>
                    <select
                      {...form.register(field.id, { required })}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
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
                    {field.helperText && <p className="text-xs text-gray-500">{field.helperText}</p>}
                  </div>
                );
              }
              if (field.type === "file") {
                return (
                  <div key={field.id} className="grid gap-1">
                    <label className="text-sm font-medium text-gray-800">
                      {field.label} {required && <span className="text-red-600">*</span>}
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleFileChange(field.id, e.target.files)}
                      className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-sm text-gray-900 outline-none file:mr-3 file:rounded-lg file:border-none file:bg-brand file:px-4 file:py-2 file:text-white hover:border-brand/70 focus:border-brand focus:ring-2 focus:ring-brand/30"
                    />
                    {field.helperText && <p className="text-xs text-gray-500">{field.helperText}</p>}
                    {attachments.length > 0 && (
                      <ul className="text-xs text-gray-600 list-disc pl-4">
                        {attachments.map((att, idx) => (
                          <li key={`${att.publicId}-${idx}`}>{att.publicId}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }
              return (
                <div key={field.id} className="grid gap-1">
                  <label className="text-sm font-medium text-gray-800">
                    {field.label} {required && <span className="text-red-600">*</span>}
                  </label>
                  <input
                    type={field.type === "date" ? "date" : "text"}
                    {...form.register(field.id, { required })}
                    placeholder={field.placeholder}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  />
                  {field.helperText && <p className="text-xs text-gray-500">{field.helperText}</p>}
                </div>
              );
            })}

            <button type="submit" className="btn btn-primary btn-full" disabled={submissionMutation.isPending}>
              {submissionMutation.isPending ? "Mengirim..." : "Kirim Surat"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-600">Tidak ada template tersedia.</p>
        )}
      </div>

      <div className="card p-5 md:p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-brand text-xl">inbox</span>
          <h2 className="text-lg font-semibold text-gray-900">Riwayat Surat</h2>
        </div>
        <div className="space-y-2">
          {submissions.map((s) => (
            <div key={s.id} className="rounded-xl border border-orange-100 bg-white/90 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{s.title}</div>
                  <div className="text-xs text-gray-600">Template: {s.template.title}</div>
                </div>
                <span className="text-xs font-semibold text-orange-800 bg-orange-50 px-2 py-1 rounded-lg ring-1 ring-orange-200">{s.status}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">Dikirim: {new Date(s.createdAt).toLocaleString()}</div>
              <a
                href={`/api/forms/submissions/${s.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand"
              >
                <span className="material-symbols-rounded text-sm">picture_as_pdf</span>
                PDF
              </a>
            </div>
          ))}
          {submissions.length === 0 && !isFetching && <p className="text-sm text-gray-600">Belum ada surat.</p>}
        </div>
      </div>
    </div>
  );
}
