"use client";

import FormLayout from "@/components/forms/FormLayout";
import {
  FileField,
  InputField,
  SelectField,
} from "@/components/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const programStudiOptions = [
  { value: "S1 Sistem Informasi", label: "S1 Sistem Informasi" },
  { value: "S1 Informatika", label: "S1 Informatika" },
  { value: "D3 Informatika", label: "D3 Informatika" },
  { value: "S1 Sains Data", label: "S1 Sains Data" },
];

const pdfFile = z.custom<FileList>(
  (files) => files instanceof FileList && files.length > 0,
  { message: "Unggah surat pernyataan (PDF)." }
).refine(
  (files) => {
    if (!(files instanceof FileList) || files.length === 0) return false;
    const file = files[0];
    return file.type === "application/pdf";
  },
  { message: "Hanya menerima PDF." }
).refine(
  (files) => {
    if (!(files instanceof FileList) || files.length === 0) return false;
    const file = files[0];
    return file.size <= 10 * 1024 * 1024;
  },
  { message: "Ukuran maksimal 10MB." }
);

const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  nim: z.string().min(1, "NIM wajib diisi"),
  programStudi: z.enum(["S1 Sistem Informasi", "S1 Informatika", "D3 Informatika", "S1 Sains Data"]),
  tempatTanggalLahir: z.string().min(1, "Tempat/tanggal lahir wajib diisi"),
  noHpWa: z.string().min(1, "Nomor HP/WA wajib diisi"),
  email: z.string().email("Email tidak valid"),
  namaProgramBeasiswa: z.string().min(1, "Nama program beasiswa wajib diisi"),
  penyelenggaraBeasiswa: z.string().min(1, "Penyelenggara wajib diisi"),
  suratPernyataanTidakMenerimaBeasiswa: pdfFile,
});

type FormValues = z.infer<typeof schema>;

export default function SuratKeteranganTidakMenerimaBeasiswaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    alert("Pengajuan berhasil dikirim (mock).");
    reset();
  };

  return (
    <FormLayout
      title="Surat Keterangan Tidak Menerima Beasiswa"
      description="Isi data berikut dan unggah surat pernyataan bertanda tangan di atas materai."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Nama"
            required
            registration={register("nama")}
            error={errors.nama?.message}
          />
          <InputField
            label="NIM"
            required
            registration={register("nim")}
            error={errors.nim?.message}
          />
          <SelectField
            label="Program Studi"
            required
            registration={register("programStudi")}
            options={programStudiOptions}
            error={errors.programStudi?.message}
            placeholder="Pilih program studi"
          />
          <InputField
            label="Tempat, Tanggal Lahir"
            required
            registration={register("tempatTanggalLahir")}
            error={errors.tempatTanggalLahir?.message}
            placeholder="Contoh: Jakarta, 01 Januari 2000"
          />
          <InputField
            label="No. HP / WA"
            required
            registration={register("noHpWa")}
            error={errors.noHpWa?.message}
            placeholder="08xxxxxxxxxx"
          />
          <InputField
            label="Email"
            type="email"
            required
            registration={register("email")}
            error={errors.email?.message}
            placeholder="email aktif"
          />
          <InputField
            label="Nama Program Beasiswa"
            required
            registration={register("namaProgramBeasiswa")}
            error={errors.namaProgramBeasiswa?.message}
          />
          <InputField
            label="Penyelenggara Beasiswa"
            required
            registration={register("penyelenggaraBeasiswa")}
            error={errors.penyelenggaraBeasiswa?.message}
          />
        </div>

        <FileField
          label="Surat Pernyataan Mahasiswa Tidak Menerima Beasiswa dari Pihak Manapun"
          required
          registration={register("suratPernyataanTidakMenerimaBeasiswa")}
          error={errors.suratPernyataanTidakMenerimaBeasiswa?.message as string | undefined}
          helperText="*TTD di atas materai. Hanya PDF, maks 10MB."
          accept="application/pdf"
        />

        <div className="pt-2">
          <button type="submit" className="btn btn-primary w-full">
            Kirim Permohonan
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
