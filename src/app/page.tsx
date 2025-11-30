import Hero from "@/components/Hero";
import Steps from "@/components/Steps";
import ServicesSection from "@/components/ServicesSection";
import FAQ from "@/components/FAQ";
import { getUserFromCookies } from "@/lib/auth";

export default async function Home() {
  const user = await getUserFromCookies();
  const isStudent = user?.role === "MAHASISWA";
  const isAdmin = user?.role === "ADMIN";

  const primaryHref = isAdmin ? "/admin" : isStudent ? "/dashboard" : "/login";
  const primaryLabel = isAdmin ? "Masuk Admin" : isStudent ? "Buka Dashboard Mahasiswa" : "Masuk untuk Mulai";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff5eb] via-white to-[#fff0e0]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pt-10 md:pt-14">
        <Hero primaryHref={primaryHref} primaryLabel={primaryLabel} secondaryHref="#layanan" secondaryLabel="Lihat Layanan" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 pb-12 space-y-10 md:space-y-12">
        <section id="mulai" className="grid gap-6 md:grid-cols-[1.05fr_1fr]">
          <div className="card p-6 md:p-8 space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Mulai</p>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              {isStudent ? "Lanjutkan permohonan Anda dari dashboard mahasiswa" : "Masuk untuk mengajukan permohonan surat"}
            </h3>
            <p className="text-sm text-gray-700">
              Pilihan layanan hanya dapat diisi setelah login sebagai mahasiswa. Masuk untuk mengakses dashboard dan pilih surat
              yang sesuai.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={primaryHref} className="btn btn-primary">
                {primaryLabel}
              </a>
              {!isAdmin && (
                <a href="/login" className="btn btn-outline">
                  Login Admin
                </a>
              )}
            </div>
          </div>
          <section className="card p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">Informasi Penting</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Gunakan email kampus UPNVJ saat login.</li>
              <li>Pilih dan isi permohonan melalui dashboard mahasiswa.</li>
              <li>Status surat diproses oleh admin sesuai SOP fakultas.</li>
            </ul>
          </section>
        </section>

        <Steps />

        <ServicesSection locked={!isStudent} lockedHref={primaryHref} />

        <FAQ />
      </div>
    </main>
  );
}
