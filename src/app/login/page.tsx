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
    <main className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-white">
      <div className="mx-auto w-full max-w-md px-4 py-12">
        <div className="card p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Login Admin</p>
            <h1 className="text-2xl font-semibold text-gray-900">Masuk untuk mengelola surat</h1>
            <p className="text-sm text-gray-600">
              Gunakan kredensial admin yang telah dibuat. Hubungi super admin jika belum memiliki akun.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
