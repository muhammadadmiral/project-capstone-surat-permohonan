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
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="absolute inset-0 academic-pattern opacity-80" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12 lg:flex-row lg:items-center lg:gap-16">
        <section className="max-w-xl space-y-6 text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 ring-1 ring-orange-200">
            Sistem Persuratan FIK
          </span>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">
              Kelola surat mahasiswa dengan tampilan yang lebih jelas
            </h1>
            <p className="text-base text-gray-700">
              Gunakan email UPNVJ dan kredensial terbaru untuk mengakses dashboard admin. Semua elemen dibuat
              kontras agar tetap terbaca di latar apa pun.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4 rounded-2xl bg-white/80 p-4 text-left text-sm text-gray-700 ring-1 ring-orange-100 lg:justify-start">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-50 text-brand ring-1 ring-orange-200">
              <span className="material-symbols-rounded">verified_user</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">Akses aman untuk tim admin</p>
              <p className="text-gray-600">Hanya staf yang memiliki hak kelola surat dapat masuk.</p>
            </div>
          </div>
        </section>

        <div className="w-full max-w-md">
          <div className="card space-y-6 bg-white/90 p-6 shadow-lg ring-1 ring-orange-100 backdrop-blur md:p-8">
            <div className="space-y-2 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">Login Admin</p>
              <h2 className="text-xl font-semibold text-gray-900">Masuk untuk mengelola surat</h2>
              <p className="text-sm text-gray-600">
                Pastikan menggunakan akun resmi UPNVJ. Jika belum memiliki akun, silakan hubungi super admin.
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
