import QuickStartForm from "@/components/QuickStartForm";
import Hero from "@/components/Hero";
import Steps from "@/components/Steps";
import ServicesSection from "@/components/ServicesSection";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff5eb] via-white to-[#fff0e0]">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8 pt-10 md:pt-14">
        <Hero />
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 pb-12 space-y-8 md:space-y-10">
        <div className="grid gap-6 md:grid-cols-[1.05fr_1fr]">
          <QuickStartForm />
          <section className="card p-6 md:p-8">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Informasi Penting
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
              <li>Gunakan email aktif kampus untuk memudahkan verifikasi.</li>
              <li>Pastikan data yang diinput benar dan sesuai dokumen.</li>
              <li>Waktu proses dapat bervariasi sesuai jenis layanan.</li>
            </ul>
          </section>
        </div>

        <Steps />

        <ServicesSection />

        <FAQ />
      </div>
    </main>
  );
}
