export default function Footer() {
  return (
    <footer id="kontak" className="mt-10 border-t border-orange-100 bg-white/80">
      <div className="mx-auto max-w-6xl w-full px-4 py-10 grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900 font-semibold">
            <span className="material-symbols-rounded text-brand text-base">domain</span>
            FIK UPN Veteran Jakarta
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Layanan Persuratan Akademik Fakultas Ilmu Komputer. Satu pintu resmi untuk pengajuan, verifikasi,
            dan penerbitan dokumen kampus.
          </p>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">Kontak</div>
          <ul className="mt-2 text-sm text-gray-600 space-y-1.5">
            <li className="flex flex-wrap items-center gap-2">
              <span className="material-symbols-rounded text-brand text-base">mail</span>
              <a className="text-brand hover:underline break-all" href="mailto:fik@upnvj.ac.id">fik@upnvj.ac.id</a>
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-rounded text-brand text-base">call</span>
              021-000000
            </li>
            <li className="flex items-center gap-2">
              <span className="material-symbols-rounded text-brand text-base">location_on</span>
              Pondok Labu, Jakarta Selatan
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">Tautan</div>
          <ul className="mt-2 text-sm text-gray-600 space-y-1.5">
            <li><a className="hover:text-brand" href="#mulai">Mulai Permohonan</a></li>
            <li><a className="hover:text-brand" href="#layanan">Daftar Layanan</a></li>
            <li><a className="hover:text-brand" href="#faq">FAQ</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-orange-100 py-4 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} FIK UPN Veteran Jakarta
      </div>
    </footer>
  );
}
