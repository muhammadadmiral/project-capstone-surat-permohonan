"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type LetterStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "SENT";

type Letter = {
  id: string;
  title: string;
  type: string;
  status: LetterStatus;
  studentName: string;
  nim: string;
  email: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MAHASISWA";
};

const statusOptions: LetterStatus[] = ["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED", "SENT"];

export default function AdminDashboard({
  currentUser,
  initialLetters,
}: {
  currentUser: CurrentUser;
  initialLetters: Letter[];
}) {
  const [letters, setLetters] = useState<Letter[]>(initialLetters);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "MAHASISWA" });
  const [letterForm, setLetterForm] = useState({
    title: "",
    type: "",
    studentName: "",
    nim: "",
    email: "",
    notes: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const stats = useMemo(() => {
    const total = letters.length;
    const byStatus = statusOptions.reduce<Record<LetterStatus, number>>(
      (acc, s) => ({ ...acc, [s]: letters.filter((l) => l.status === s).length }),
      { DRAFT: 0, IN_REVIEW: 0, APPROVED: 0, REJECTED: 0, SENT: 0 }
    );
    return { total, byStatus };
  }, [letters]);

  function formatDate(dateString: string) {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateString));
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat akun.");
        return;
      }
      setMessage(`Akun ${data.user.email} berhasil dibuat sebagai ${data.user.role}.`);
      setUserForm({ name: "", email: "", password: "", role: "MAHASISWA" });
    });
  }

  async function handleCreateLetter(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letterForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat surat.");
        return;
      }
      setLetters((prev) => [{ ...data.letter, createdAt: data.letter.createdAt, updatedAt: data.letter.updatedAt }, ...prev]);
      setMessage(`Surat ${data.letter.title} ditambahkan.`);
      setLetterForm({ title: "", type: "", studentName: "", nim: "", email: "", notes: "" });
    });
  }

  async function handleStatusChange(id: string, status: LetterStatus) {
    setError(null);
    setMessage(null);
    const prev = letters;
    setLetters((l) => l.map((item) => (item.id === id ? { ...item, status } : item)));

    const res = await fetch(`/api/letters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal memperbarui status.");
      setLetters(prev);
    } else {
      const data = await res.json();
      setLetters((l) => l.map((item) => (item.id === id ? { ...item, ...data.letter } : item)));
      setMessage("Status berhasil diperbarui.");
    }
  }

  async function handleRefresh() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const res = await fetch("/api/letters");
      const data = await res.json();
      if (res.ok) {
        setLetters(
          data.letters.map((l: Letter) => ({
            ...l,
            createdAt: l.createdAt,
            updatedAt: l.updatedAt,
          }))
        );
      } else {
        setError(data.error || "Gagal memuat surat.");
      }
    });
  }

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
          <p className="text-sm text-gray-600">
            Kelola surat, buat akun admin/mahasiswa, dan unduh PDF surat.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleRefresh}
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
          <p className="text-xs text-gray-600">Termasuk {stats.byStatus.APPROVED} selesai dan {stats.byStatus.IN_REVIEW} diproses.</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.16em] text-orange-700">Sedang diproses</div>
          <div className="text-3xl font-semibold text-gray-900 mt-1">{stats.byStatus.IN_REVIEW}</div>
          <p className="text-xs text-gray-600">Surat menunggu verifikasi atau kelengkapan.</p>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm">
          <div className="text-xs uppercase tracking-[0.16em] text-orange-700">Terkirim/terbit</div>
          <div className="text-3xl font-semibold text-gray-900 mt-1">{stats.byStatus.SENT}</div>
          <p className="text-xs text-gray-600">Dokumen siap diunduh atau sudah dikirim.</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleCreateUser} className="card p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-brand text-xl">person_add</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Buat Akun</h2>
              <p className="text-sm text-gray-600">Admin bisa menambah akun admin atau mahasiswa.</p>
            </div>
          </div>
          <div className="grid gap-3">
            <input
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              placeholder="Nama lengkap"
              required
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              placeholder="Email kampus"
              required
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              type="password"
              value={userForm.password}
              onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
              placeholder="Password"
              required
              minLength={6}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <select
              value={userForm.role}
              onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              <option value="MAHASISWA">Mahasiswa</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary btn-full"
          >
            {isPending ? "Memproses..." : "Simpan Akun"}
          </button>
        </form>

        <form onSubmit={handleCreateLetter} className="card p-5 md:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-brand text-xl">description</span>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tambah Surat</h2>
              <p className="text-sm text-gray-600">Catat surat baru untuk pemantauan admin.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input
              value={letterForm.title}
              onChange={(e) => setLetterForm({ ...letterForm, title: e.target.value })}
              placeholder="Judul surat"
              required
              className="md:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              value={letterForm.type}
              onChange={(e) => setLetterForm({ ...letterForm, type: e.target.value })}
              placeholder="Jenis surat (ex: Rekomendasi, Cuti)"
              required
              className="md:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              value={letterForm.studentName}
              onChange={(e) => setLetterForm({ ...letterForm, studentName: e.target.value })}
              placeholder="Nama mahasiswa"
              required
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              value={letterForm.nim}
              onChange={(e) => setLetterForm({ ...letterForm, nim: e.target.value })}
              placeholder="NIM"
              required
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <input
              type="email"
              value={letterForm.email}
              onChange={(e) => setLetterForm({ ...letterForm, email: e.target.value })}
              placeholder="Email mahasiswa"
              required
              className="md:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
            <textarea
              value={letterForm.notes}
              onChange={(e) => setLetterForm({ ...letterForm, notes: e.target.value })}
              placeholder="Catatan (opsional)"
              className="md:col-span-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              rows={3}
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-outline btn-full"
          >
            {isPending ? "Memproses..." : "Tambah Surat"}
          </button>
        </form>
      </div>

      <div className="card p-5 md:p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-rounded text-brand text-xl">table</span>
            <h2 className="text-lg font-semibold text-gray-900">Daftar Surat</h2>
          </div>
          <span className="text-xs text-gray-600">Login sebagai {currentUser.email}</span>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="px-3 py-2">Judul</th>
                <th className="px-3 py-2">Mahasiswa</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Terakhir</th>
                <th className="px-3 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-50">
              {letters.map((letter) => (
                <tr key={letter.id} className="align-top">
                  <td className="px-3 py-3">
                    <div className="font-semibold text-gray-900">{letter.title}</div>
                    <div className="text-xs text-gray-600">{letter.type}</div>
                    {letter.notes && <div className="text-xs text-orange-800 mt-1">Catatan: {letter.notes}</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-gray-900">{letter.studentName}</div>
                    <div className="text-xs text-gray-600">NIM: {letter.nim}</div>
                    <div className="text-xs text-gray-600">{letter.email}</div>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={letter.status}
                      onChange={(e) => handleStatusChange(letter.id, e.target.value as LetterStatus)}
                      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600">
                    <div>Dibuat: {formatDate(letter.createdAt)}</div>
                    <div>Update: {formatDate(letter.updatedAt)}</div>
                  </td>
                  <td className="px-3 py-3 space-y-2">
                    <a
                      href={`/api/letters/${letter.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-semibold text-orange-900 ring-1 ring-orange-200 hover:bg-orange-200"
                    >
                      <span className="material-symbols-rounded text-sm">picture_as_pdf</span>
                      PDF
                    </a>
                    <button
                      onClick={() => navigator.clipboard?.writeText(letter.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 ring-1 ring-gray-200 hover:bg-gray-50"
                    >
                      <span className="material-symbols-rounded text-sm">content_copy</span>
                      ID
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {letters.length === 0 && (
            <div className="py-6 text-center text-sm text-gray-600">Belum ada surat terdata.</div>
          )}
        </div>
      </div>
    </div>
  );
}
