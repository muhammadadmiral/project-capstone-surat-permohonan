import FormLayout from "@/components/forms/FormLayout";
import Link from "next/link";

export default function RekomendasiMbkmFallbackPage() {
  return (
    <FormLayout
      title="Permohonan Surat Rekomendasi Magang"
      description="Formulir resmi saat ini tidak menerima respons. Silakan hubungi admin fakultas untuk bantuan."
    >
      <div className="rounded-2xl border border-orange-200 bg-orange-50/80 p-5 text-sm text-orange-900 space-y-3">
        <p className="font-semibold">Form sudah ditutup</p>
        <p>
          Form Permohonan Surat Rekomendasi Magang sedang tidak menerima pengajuan. Jika ini tidak sesuai,
          silakan hubungi admin fakultas untuk konfirmasi atau pengajuan manual.
        </p>
        <div className="space-y-1 text-orange-900/90">
          <p>
            Email:{" "}
            <a href="mailto:fik@upnvj.ac.id" className="text-brand font-semibold underline underline-offset-4">
              fik@upnvj.ac.id
            </a>
          </p>
          <p>Loket fakultas: 08.00 - 16.00 (Senin - Jumat)</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <Link href="/" className="btn btn-primary md:w-auto text-center">
          Kembali ke Beranda
        </Link>
        <Link href="/#layanan" className="btn btn-outline md:w-auto text-center">
          Lihat Layanan Lain
        </Link>
      </div>
    </FormLayout>
  );
}
