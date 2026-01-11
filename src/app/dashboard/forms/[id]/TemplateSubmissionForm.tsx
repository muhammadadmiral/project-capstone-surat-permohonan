"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

type Attachment = {
  url: string;
  publicId: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  type?: string;
  fieldId: string;
};

type FormValues = Record<string, any>;

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Permintaan gagal");
  return data;
}

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

export default function TemplateSubmissionForm({ templateKey }: { templateKey: string }) {
  const qc = useQueryClient();
  const form = useForm<FormValues>({});
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [formKey, setFormKey] = useState(0);

  const { data: templateData, isLoading, isError, error } = useQuery<{ template: Template }>({
    queryKey: ["template", templateKey],
    queryFn: () => jsonFetch(`/api/forms/templates/${encodeURIComponent(templateKey)}`),
  });

  const template = templateData?.template || null;
  const requiredCount = useMemo(
    () => (template?.schema || []).filter((field) => field.required).length,
    [template]
  );

  useEffect(() => {
    form.reset({});
    setAttachments([]);
    setFormKey((prev) => prev + 1);
  }, [template?.id]);

  const submissionMutation = useMutation({
    mutationFn: (payload: any) =>
      jsonFetch("/api/forms/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast.success("Surat terkirim", {
        description: "Permohonan Anda sudah masuk. Pantau status di dashboard.",
      });
      form.reset({});
      setAttachments([]);
      setFormKey((prev) => prev + 1);
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (err: any) => {
      toast.error("Gagal mengirim surat", {
        description: err.message || "Coba ulangi beberapa saat lagi.",
      });
    },
  });

  async function handleFileChange(fieldId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    try {
      const uploads = [] as Omit<Attachment, "fieldId">[];
      for (const file of Array.from(files)) {
        const up = await uploadToCloudinary(file);
        uploads.push(up);
      }
      setAttachments((prev) => [
        ...prev.filter((att) => att.fieldId !== fieldId),
        ...uploads.map((u) => ({ ...u, fieldId })),
      ]);
      form.setValue(
        fieldId,
        uploads.map((u) => u.url),
        { shouldValidate: true, shouldDirty: true }
      );
    } catch (err: any) {
      toast.error("Upload gagal", { description: err.message || "Periksa koneksi atau file Anda." });
    }
  }

  function onSubmit(values: FormValues) {
    if (!template) return;
    const submissionAttachments = attachments.map(({ fieldId, ...rest }) => rest);
    const payload = {
      templateId: template.id,
      title: template.title,
      payload: values,
      attachments: submissionAttachments,
    };
    submissionMutation.mutate(payload);
  }

  function onError() {
    toast.error("Form belum lengkap", {
      description: "Lengkapi semua field wajib sebelum mengirim.",
    });
  }

  const errors = form.formState.errors as Record<string, any>;

  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-600">
        <span className="material-symbols-rounded text-base">arrow_back</span>
        Kembali ke Dashboard
      </Link>

      <div className="rounded-2xl border border-orange-100 bg-white/95 p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Detail Form Permohonan</p>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {template?.title || "Memuat template"}
            </h1>
            <p className="text-sm text-gray-600">
              {template?.description || "Lengkapi data sesuai kebutuhan surat yang dipilih."}
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm text-orange-900">
            <span className="material-symbols-rounded text-base">fact_check</span>
            {template ? `${requiredCount} wajib dari ${template.schema.length} field` : "Memuat skema"}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="card p-6 text-sm text-gray-600">Memuat form...</div>
      )}

      {isError && (
        <div className="card p-6 text-sm text-gray-600">
          {error instanceof Error ? error.message : "Gagal memuat template."}
        </div>
      )}

      {!isLoading && !isError && !template && (
        <div className="card p-6 text-sm text-gray-600">
          Template tidak ditemukan. Silakan kembali ke dashboard dan pilih ulang.
        </div>
      )}

      {template && (
        <form
          key={formKey}
          className="card space-y-4 bg-white/95 p-6 shadow-lg ring-1 ring-orange-100"
          onSubmit={form.handleSubmit(onSubmit, onError)}
        >
          {template.schema.map((field) => {
            const requiredRule = field.required ? { required: "Wajib diisi" } : undefined;
            const fieldError = errors[field.id];

            if (field.type === "textarea") {
              return (
                <div key={field.id} className="grid gap-1.5">
                  <label className="text-sm font-semibold text-gray-900">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  <textarea
                    {...form.register(field.id, requiredRule)}
                    placeholder={field.placeholder}
                    rows={4}
                    className="rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                  {field.helperText && <p className="text-xs text-gray-600">{field.helperText}</p>}
                  {fieldError && <p className="text-xs font-semibold text-red-600">{fieldError.message || "Wajib diisi"}</p>}
                </div>
              );
            }

            if (field.type === "select") {
              return (
                <div key={field.id} className="grid gap-1.5">
                  <label className="text-sm font-semibold text-gray-900">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  <select
                    {...form.register(field.id, requiredRule)}
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
                  {fieldError && <p className="text-xs font-semibold text-red-600">{fieldError.message || "Wajib diisi"}</p>}
                </div>
              );
            }

            if (field.type === "file") {
              const fileRegister = form.register(field.id, requiredRule);
              const fieldAttachments = attachments.filter((att) => att.fieldId === field.id);
              return (
                <div key={field.id} className="grid gap-1.5">
                  <label className="text-sm font-semibold text-gray-900">
                    {field.label} {field.required && <span className="text-red-600">*</span>}
                  </label>
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 px-4 py-3">
                    <input
                      type="file"
                      multiple
                      name={fileRegister.name}
                      ref={fileRegister.ref}
                      onBlur={fileRegister.onBlur}
                      onChange={(e) => {
                        fileRegister.onChange(e);
                        handleFileChange(field.id, e.target.files);
                      }}
                      className="w-full text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-none file:bg-brand file:px-4 file:py-2 file:text-white hover:border-brand/70 focus:outline-none"
                    />
                    {field.helperText && <p className="mt-1 text-xs text-gray-600">{field.helperText}</p>}
                    {fieldAttachments.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-gray-700">
                        {fieldAttachments.map((att) => (
                          <li key={att.publicId} className="max-w-full break-all rounded-full bg-white px-3 py-1 ring-1 ring-orange-200">
                            {att.publicId}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {fieldError && <p className="text-xs font-semibold text-red-600">{fieldError.message || "Wajib diisi"}</p>}
                </div>
              );
            }

            return (
              <div key={field.id} className="grid gap-1.5">
                <label className="text-sm font-semibold text-gray-900">
                  {field.label} {field.required && <span className="text-red-600">*</span>}
                </label>
                <input
                  type={field.type === "date" ? "date" : "text"}
                  {...form.register(field.id, requiredRule)}
                  placeholder={field.placeholder}
                  className="rounded-xl border border-orange-100 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
                {field.helperText && <p className="text-xs text-gray-600">{field.helperText}</p>}
                {fieldError && <p className="text-xs font-semibold text-red-600">{fieldError.message || "Wajib diisi"}</p>}
              </div>
            );
          })}

          <button
            type="submit"
            className="btn btn-primary btn-full shadow-md shadow-orange-200/60"
            disabled={submissionMutation.isPending}
          >
            {submissionMutation.isPending ? "Mengirim..." : "Kirim Surat"}
          </button>
        </form>
      )}
    </div>
  );
}
