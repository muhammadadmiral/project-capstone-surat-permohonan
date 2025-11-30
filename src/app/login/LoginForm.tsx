"use client";

import { useState, type SVGProps } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Login gagal.");
      return;
    }
    if (data.user?.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="login-email" className="text-sm font-semibold text-gray-900">
            Email UPNVJ
          </label>
          <span className="badge-soft">mahasiswa.upnvj.ac.id</span>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
            <MailIcon className="h-5 w-5" />
          </span>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
            aria-describedby="login-email-help"
            placeholder="nama@mahasiswa.upnvj.ac.id"
            className="input-surface pl-10"
          />
        </div>
        <p id="login-email-help" className="text-xs text-gray-600">
          Gunakan email kampus resmi. Admin dapat memakai email: admin@mahasiswa.upnvj.ac.id
        </p>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="login-password" className="text-sm font-semibold text-gray-900">
            Password
          </label>
          <span className="text-[11px] font-semibold text-orange-700">Min. 6 karakter</span>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-orange-500">
            <LockIcon className="h-5 w-5" />
          </span>
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="current-password"
            aria-describedby="login-password-help"
            placeholder="Masukkan kata sandi"
            className="input-surface pl-10 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 transition hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <div
          id="login-password-help"
          className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600"
        >
          <span>Gunakan kata sandi akun. Minta reset jika tidak bisa masuk.</span>
          <a
            className="font-semibold text-brand hover:text-brand-600"
            href="mailto:fik@upnvj.ac.id?subject=Reset%20Password%20Admin%20Persuratan"
          >
            Lupa password?
          </a>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-full shadow-[0_30px_80px_-45px_rgba(249,115,22,0.9)] transition-transform hover:-translate-y-0.5 disabled:translate-y-0"
      >
        {loading ? "Memproses..." : "Masuk ke Dashboard"}
      </button>
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span className="flex items-center gap-2 font-semibold text-gray-700">
          <span className="material-symbols-rounded text-base text-green-600">lock</span>
          Sesi terenkripsi
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">Tekan Enter untuk masuk</span>
      </div>
    </form>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7C20.268 16.057 16.477 19 12 19s-8.268-2.943-9.542-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function EyeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m3 3 18 18" />
      <path d="M9.88 4.61A9.77 9.77 0 0 1 12 4.5c4.477 0 8.268 2.943 9.542 7a10.44 10.44 0 0 1-1.754 3.26" />
      <path d="M6.415 6.425C4.26 7.74 2.76 9.727 2.458 12c.8 4.174 4.532 7 9.042 7a9.79 9.79 0 0 0 4.5-1.07" />
      <path d="M10.477 10.489a3 3 0 0 0 4.034 4.034" />
    </svg>
  );
}
