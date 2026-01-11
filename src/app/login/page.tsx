import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const user = await getUserFromCookies();
  if (user) {
    if (user.role === "ADMIN") redirect("/admin");
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50 via-white to-orange-100">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(251,146,60,0.22),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(255,237,213,0.8),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(249,115,22,0.14),transparent_55%)]"
        aria-hidden="true"
      />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-300/30 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-[-6rem] h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-orange-200/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-10 px-4 py-12 lg:flex-row lg:items-center lg:gap-16">
        <section className="max-w-xl space-y-8 text-gray-900 lg:text-left">
          <span className="badge-soft border border-orange-200 bg-orange-50/80 text-orange-700 ring-orange-100/70">
            Sistem Persuratan FIK
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Masuk ke <span className="text-orange-700">dashboard persuratan</span> yang lebih rapi dan kencang.
            </h1>
            <p className="text-base text-gray-700">
              Kelola alur surat, verifikasi mahasiswa, dan pantau status permohonan dalam satu panel aman.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                <span className="material-symbols-rounded text-lg">shield_lock</span>
                Otorisasi terproteksi
              </div>
              <p className="mt-2 text-sm text-gray-700">Hanya akun resmi UPNVJ yang bisa masuk; sesi dilindungi token.</p>
            </div>
            <div className="rounded-2xl border border-orange-100 bg-white/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
                <span className="material-symbols-rounded text-lg">bolt</span>
                Akses cepat
              </div>
              <p className="mt-2 text-sm text-gray-700">Login langsung ke peran masing-masing: admin atau mahasiswa.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-white/80 p-4 text-sm text-gray-700 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-100 ring-1 ring-orange-200">
              <span className="material-symbols-rounded text-2xl text-orange-700">verified_user</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">Aktif 24/7 untuk pengajuan surat</p>
              <p className="text-gray-700">Semua aktivitas tercatat; gunakan email kampus untuk memulai.</p>
            </div>
          </div>
        </section>

        <div className="w-full max-w-md">
          <div className="glass-panel space-y-6 text-gray-900">
            <div className="space-y-2 text-left text-gray-900">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Login Persuratan</p>
              <h2 className="text-2xl font-semibold text-gray-900">Masuk untuk kelola atau ajukan surat</h2>
              <p className="text-sm text-gray-600">
                Gunakan kredensial UPNVJ. Sistem otomatis mengarahkan sesuai peran Anda.
              </p>
            </div>
            <div className="rounded-xl border border-orange-100 bg-orange-50/80 px-4 py-3 text-sm text-gray-900 shadow-inner">
              <div className="flex items-center gap-2 font-semibold text-orange-700">
                <span className="material-symbols-rounded text-lg">info</span>
                Tips cepat
              </div>
              <p className="mt-1 text-gray-700">Gunakan email kampus, pastikan caps lock mati, dan simpan password aman.</p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
