"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
  avatarUrl?: string | null;
};

type ProfileForm = {
  name: string;
  avatarUrl?: string | null;
  passwordCurrent?: string;
  passwordNext?: string;
};

async function uploadToCloudinary(file: File) {
  const sign = await jsonFetch<{ signature: string; timestamp: number; apiKey?: string; cloudName?: string }>("/api/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "persuratan/profiles" }),
  });
  if (!sign.cloudName || !sign.apiKey) throw new Error("Cloudinary belum dikonfigurasi");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sign.apiKey);
  form.append("timestamp", String(sign.timestamp));
  form.append("signature", sign.signature);
  form.append("folder", "persuratan/profiles");

  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload gagal");
  return { url: data.secure_url as string };
}

export default function SettingsPanel({ currentUser }: { currentUser: CurrentUser }) {
  const qc = useQueryClient();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ProfileForm>({ defaultValues: { name: currentUser.name, avatarUrl: currentUser.avatarUrl || undefined } });

  const updateMutation = useMutation({
    mutationFn: (values: ProfileForm) =>
      jsonFetch<{ user: CurrentUser }>("/api/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          avatarUrl: values.avatarUrl ?? null,
          password: values.passwordCurrent && values.passwordNext ? { current: values.passwordCurrent, next: values.passwordNext } : undefined,
        }),
      }),
    onSuccess: () => {
      setMessage("Profil berhasil diperbarui.");
      setError(null);
      form.reset({ ...form.getValues(), passwordCurrent: "", passwordNext: "" });
      qc.invalidateQueries();
      router.refresh();
    },
    onError: (err: any) => {
      setMessage(null);
      setError(err.message || "Gagal memperbarui profil");
    },
  });

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setMessage(null);
      setError(null);
      const uploaded = await uploadToCloudinary(file);
      form.setValue("avatarUrl", uploaded.url, { shouldDirty: true });
      setMessage("Foto profil diunggah.");
    } catch (err: any) {
      setError(err.message || "Upload gagal");
    }
  }

  return (
    <div className="card p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Pengaturan Akun</p>
          <h1 className="text-2xl font-semibold text-gray-900">Profil & Keamanan</h1>
          <p className="text-sm text-gray-600">Ubah nama, foto profil, dan password Anda.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-orange-100 grid place-items-center text-brand text-lg overflow-hidden ring-2 ring-orange-200">
            {form.watch("avatarUrl") ? (
              <img src={form.watch("avatarUrl")!} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              currentUser.name.slice(0, 1).toUpperCase()
            )}
          </div>
        </div>
      </div>

      {(message || error) && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${
            error ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {error || message}
        </div>
      )}

      <form className="space-y-5" onSubmit={form.handleSubmit((values) => updateMutation.mutate(values))}>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-800">Nama</label>
          <input
            {...form.register("name", { required: true })}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-800">Foto profil</label>
          <div className="flex items-center gap-3">
            <input type="file" accept="image/*" onChange={handleAvatar} className="text-sm" />
            {form.watch("avatarUrl") && (
              <button
                type="button"
                onClick={() => form.setValue("avatarUrl", null, { shouldDirty: true })}
                className="text-xs text-red-600"
              >
                Hapus foto
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium text-gray-800">Password (opsional)</label>
          <input
            type="password"
            placeholder="Password sekarang"
            {...form.register("passwordCurrent")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <input
            type="password"
            placeholder="Password baru"
            {...form.register("passwordNext")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <p className="text-xs text-gray-500">Isi keduanya jika ingin mengganti password.</p>
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Menyimpan..." : "Simpan perubahan"}
        </button>
      </form>
    </div>
  );
}
