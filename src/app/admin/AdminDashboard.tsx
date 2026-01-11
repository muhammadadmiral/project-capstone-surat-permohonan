"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useFieldArray } from "react-hook-form";
import { useRouter } from "next/navigation";

const statusOptions = ["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED", "SENT", "CANCELLED"] as const;

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
  isActive: boolean;
  schema: TemplateField[];
};

type Submission = {
  id: string;
  title: string;
  status: string;
  payload: Record<string, any>;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  template: Template;
};

async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Permintaan gagal");
  return data;
}

export default function AdminDashboard({ currentUser }: { currentUser: CurrentUser }) {
  const router = useRouter();
  const qc = useQueryClient();
  const [userMessage, setUserMessage] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  const { data: templatesData } = useQuery<{ templates: Template[] }>({ queryKey: ["templates"], queryFn: () => jsonFetch("/api/forms/templates") });
  const { data: submissionsData, isFetching } = useQuery<{ submissions: Submission[] }>({ queryKey: ["submissions"], queryFn: () => jsonFetch("/api/forms/submissions") });

  const submissions = submissionsData?.submissions || [];
  const templates = templatesData?.templates || [];

  const stats = useMemo(() => {
    const total = submissions.length;
    const byStatus = statusOptions.reduce<Record<string, number>>((acc, s) => {
      acc[s] = submissions.filter((l) => l.status === s).length;
      return acc;
    }, {} as Record<string, number>);
    return { total, byStatus };
  }, [submissions]);

  const createTemplateForm = useForm<{ slug: string; title: string; description?: string; isActive: boolean; schema: TemplateField[] }>({
    defaultValues: { slug: "", title: "", description: "", isActive: true, schema: [] },
  });
  const { fields, append, remove } = useFieldArray({ name: "schema", control: createTemplateForm.control });

  const templateMutation = useMutation({
    mutationFn: (payload: any) => jsonFetch("/api/forms/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["templates"] });
      createTemplateForm.reset({ slug: "", title: "", description: "", isActive: true, schema: [] });
    },
  });

  const submissionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      jsonFetch(`/api/forms/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["submissions"] }),
  });

  const createUserForm = useForm<{ name: string; email: string; password: string; role: "ADMIN" | "MAHASISWA" }>({
    defaultValues: { name: "", email: "", password: "", role: "MAHASISWA" },
  });

  const createUserMutation = useMutation({
    mutationFn: (values: { name: string; email: string; password: string; role: "ADMIN" | "MAHASISWA" }) =>
      jsonFetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      setUserMessage("Akun baru berhasil dibuat.");
      setUserError(null);
      createUserForm.reset({ name: "", email: "", password: "", role: "MAHASISWA" });
    },
    onError: (err: any) => {
      setUserMessage(null);
      setUserError(err.message || "Gagal membuat akun.");
    },
  });

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Panel Admin</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Manajemen Persuratan</h1>
          <p className="text-sm text-gray-600">Kelola template dinamis, status surat, dan akun.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => qc.invalidateQueries({ queryKey: ["submissions"] })}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-orange-50"
          >
            <span className="material-symbols-rounded text-base text-brand">refresh</span>
            Muat ulang
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-900 shadow-sm hover:bg-orange-200"
          >
            <span className="material-symbols-rounded text-base">logout</span>
            Keluar
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.16em] text-orange-700">Total Surat</div>
          <div className="text-3xl font-semibold text-gray-900 mt-1">{stats.total}</div>
          <p className="text-xs text-gray-600">{stats.byStatus.APPROVED || 0} selesai / {stats.byStatus.IN_REVIEW || 0} proses</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.16em] text-orange-700">Template aktif</div>
          <div className="text-3xl font-semibold text-gray-900 mt-1">{templates.filter((t) => t.isActive).length}</div>
          <p className="text-xs text-gray-600">{templates.length} total template</p>
        </div>
      <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
        <div className="text-xs uppercase tracking-[0.16em] text-orange-700">Akun</div>
        <div className="mt-1 text-sm font-semibold text-gray-900 break-all sm:text-base">{currentUser.email}</div>
        <p className="text-xs text-gray-600">Role: {currentUser.role}</p>
      </div>
    </div>

      <div className="card p-5 md:p-6 space-y-4 border border-orange-100">
        <div className="flex items-center gap-2">
          <span className="material-symbols-rounded text-brand text-xl">person_add</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tambah Akun</h2>
            <p className="text-sm text-gray-600">Buat admin atau mahasiswa baru langsung dari panel.</p>
          </div>
        </div>
        {(userMessage || userError) && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${
              userError ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {userError || userMessage}
          </div>
        )}
        <form
          className="grid gap-3 md:grid-cols-2"
          onSubmit={createUserForm.handleSubmit((values) => createUserMutation.mutate(values))}
        >
          <div className="md:col-span-2 grid gap-2">
            <label className="text-sm font-semibold text-gray-800">Nama</label>
            <input
              {...createUserForm.register("name", { required: true })}
              placeholder="Nama lengkap"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-gray-800">Email</label>
            <input
              type="email"
              {...createUserForm.register("email", { required: true })}
              placeholder="user@mahasiswa.upnvj.ac.id"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-semibold text-gray-800">Password</label>
            <input
              type="password"
              {...createUserForm.register("password", { required: true, minLength: 6 })}
              placeholder="Minimal 6 karakter"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </div>
          <div className="md:col-span-2 grid gap-2">
            <label className="text-sm font-semibold text-gray-800">Role</label>
            <select
              {...createUserForm.register("role", { required: true })}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="MAHASISWA">Mahasiswa</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-xs text-gray-600">Admin punya akses penuh dashboard; Mahasiswa hanya ajukan/lihat suratnya.</p>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={createUserMutation.isPending}
              className="btn btn-primary btn-full shadow-sm"
            >
              {createUserMutation.isPending ? "Membuat akun..." : "Simpan Akun"}
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          onSubmit={createTemplateForm.handleSubmit((values) => templateMutation.mutate(values))}
          className="card p-5 md:p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-brand text-xl">dynamic_form</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Buat Template Surat</h2>
              <p className="text-sm text-gray-600">Skema form dinamis dengan React Hook Form.</p>
            </div>
          </div>
          <div className="grid gap-3">
            <input
              placeholder="Slug unik (ex: pengunduran-diri)"
              {...createTemplateForm.register("slug", { required: true })}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              placeholder="Judul"
              {...createTemplateForm.register("title", { required: true })}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <textarea
              placeholder="Deskripsi"
              {...createTemplateForm.register("description")}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              rows={2}
            />
            <label className="inline-flex items-center gap-2 text-sm text-gray-800">
              <input type="checkbox" {...createTemplateForm.register("isActive")} defaultChecked />
              Aktifkan template
            </label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Field</div>
              <button
                type="button"
                onClick={() => append({ id: crypto.randomUUID(), label: "Field", type: "text", required: true })}
                className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-900 ring-1 ring-orange-200"
              >
                + Field
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, idx) => (
                <div key={field.id} className="rounded-xl border border-gray-200 bg-white p-3 space-y-2">
                  <input
                    placeholder="Label"
                    {...createTemplateForm.register(`schema.${idx}.label` as const, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Type (text, textarea, select, date, file)"
                    {...createTemplateForm.register(`schema.${idx}.type` as const, { required: true })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Placeholder"
                    {...createTemplateForm.register(`schema.${idx}.placeholder` as const)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <input
                    placeholder="Opsi (pisahkan dengan koma)"
                    {...createTemplateForm.register(`schema.${idx}.options` as const, {
                      setValueAs: (v) => (v ? String(v).split(",").map((s) => s.trim()).filter(Boolean) : []),
                    })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                  <label className="inline-flex items-center gap-2 text-sm text-gray-800">
                    <input type="checkbox" {...createTemplateForm.register(`schema.${idx}.required` as const)} defaultChecked />
                    Wajib
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="text-xs text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              ))}
              {fields.length === 0 && <p className="text-sm text-gray-500">Belum ada field.</p>}
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={templateMutation.isPending}>
            {templateMutation.isPending ? "Menyimpan..." : "Simpan Template"}
          </button>
        </form>

        <div className="card p-5 md:p-6 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-rounded text-brand text-xl">table</span>
              <h2 className="text-lg font-semibold text-gray-900">Daftar Surat</h2>
            </div>
            <span className="min-w-0 text-xs text-gray-600 break-all sm:text-right">Login: {currentUser.email}</span>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="px-3 py-2">Judul</th>
                  <th className="px-3 py-2">Template</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {submissions.map((letter) => (
                  <tr key={letter.id} className="align-top">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-gray-900">{letter.title}</div>
                      {letter.notes && <div className="text-xs text-orange-800 mt-1">Catatan: {letter.notes}</div>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-gray-900">{letter.template.title}</div>
                      <div className="text-xs text-gray-600">Slug: {letter.template.slug}</div>
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={letter.status}
                        onChange={(e) => submissionMutation.mutate({ id: letter.id, status: e.target.value })}
                        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 space-y-2">
                      <a
                        href={`/api/forms/submissions/${letter.id}/pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-900 ring-1 ring-orange-200 hover:bg-orange-200"
                      >
                        <span className="material-symbols-rounded text-sm">picture_as_pdf</span>
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {submissions.length === 0 && !isFetching && (
              <div className="py-6 text-center text-sm text-gray-600">Belum ada surat terdata.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
