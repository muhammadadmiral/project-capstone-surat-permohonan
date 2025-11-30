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
    <main className="relative min-h-screen overflow-hidden bg-[#0b1021]">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.22),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,237,213,0.35),transparent_35%),linear-gradient(135deg,#0b1021_0%,#111827_45%,#0f172a_100%)]"
        aria-hidden="true"
      />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute -right-24 bottom-[-6rem] h-96 w-96 rounded-full bg-orange-300/10 blur-3xl" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-20 h-px bg-gradient-to-r from-transparent via-orange-200/40 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12 lg:flex-row lg:items-center lg:gap-16">
        <section className="max-w-xl space-y-8 text-white lg:text-left">
          <span className="badge-soft border border-white/10 bg-white/10 text-orange-50 ring-white/10">
            Sistem Persuratan FIK
            <span className="inline-flex h-2 w-2 rounded-full bg-green-300" />
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Masuk ke <span className="text-orange-200">dashboard persuratan</span> yang lebih rapi dan kencang.
            </h1>
            <p className="text-base text-gray-200">
              Kelola alur surat, verifikasi mahasiswa, dan pantau status permohonan dalam satu panel aman.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-100">
                <span className="material-symbols-rounded text-lg">shield_lock</span>
                Otorisasi terproteksi
              </div>
              <p className="mt-2 text-sm text-gray-200">Hanya akun resmi UPNVJ yang bisa masuk; sesi dilindungi token.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange-100">
                <span className="material-symbols-rounded text-lg">bolt</span>
                Akses cepat
              </div>
              <p className="mt-2 text-sm text-gray-200">Login langsung ke peran masing-masing: admin atau mahasiswa.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-100 backdrop-blur">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-500/20 ring-1 ring-white/20">
              <span className="material-symbols-rounded text-2xl text-orange-100">verified_user</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Aktif 24/7 untuk pengajuan surat</p>
              <p className="text-gray-200">Semua aktivitas tercatat; gunakan email kampus untuk memulai.</p>
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
            <div className="rounded-xl border border-orange-100 bg-orange-50/80 px-4 py-3 text-sm text-orange-900 shadow-inner">
              <div className="flex items-center gap-2 font-semibold">
                <span className="material-symbols-rounded text-lg">info</span>
                Tips cepat
              </div>
              <p className="mt-1 text-orange-800">Gunakan email kampus, pastikan caps lock mati, dan simpan password aman.</p>
            </div>
            <LoginForm />
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-600 ring-1 ring-orange-100">
              <div className="flex items-center gap-2 font-semibold text-gray-800">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Sistem siap menerima login
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700">v1.0</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
