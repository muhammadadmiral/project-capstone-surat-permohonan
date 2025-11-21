"use client";

import FormLayout from "@/components/forms/FormLayout";
import {
  FileField,
  InputField,
  RadioGroupField,
  SelectField,
  TextareaField,
} from "@/components/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const jurusanOptions = [
  { value: "S1 Informatika", label: "S1 Informatika" },
  { value: "S1 Sistem Informasi", label: "S1 Sistem Informasi" },
  { value: "D3 Sistem Informasi", label: "D3 Sistem Informasi" },
];

const pernahCutiOptions = [
  { value: "Sudah", label: "Sudah" },
  { value: "Belum", label: "Belum" },
];

const requiredFile = z.custom<FileList>(
  (files) => files instanceof FileList && files.length > 0,
  { message: "Unggah formulir cuti yang ditandatangani." }
);

const schema = z
  .object({
    namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
    nim: z.string().min(1, "NIM wajib diisi"),
    jurusan: z.enum(["S1 Informatika", "S1 Sistem Informasi", "D3 Sistem Informasi"]),
    tempatLahir: z.string().min(1, "Tempat lahir wajib diisi"),
    tanggalLahir: z.string().min(1, "Tanggal lahir wajib diisi"),
    tanggalPengajuan: z.string().min(1, "Tanggal pengajuan wajib diisi"),
    nomorTelepon: z.string().min(1, "Nomor telepon wajib diisi"),
    alamatRumah: z.string().min(1, "Alamat rumah wajib diisi"),
    kodePos: z.string().min(1, "Kode pos wajib diisi"),
    email: z.string().email("Email tidak valid"),
    namaOrangTua: z.string().optional(),
    pembimbingAkademik: z.string().min(1, "Pembimbing akademik wajib diisi"),
    pernahCutiSebelumnya: z.enum(["Sudah", "Belum"]),
    detailCutiSebelumnya: z.string().optional(),
    formulirCutiDitandatangani: requiredFile,
  })
  .superRefine((values, ctx) => {
    if (values.pernahCutiSebelumnya === "Sudah" && !values.detailCutiSebelumnya?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["detailCutiSebelumnya"],
        message: "Mohon jelaskan riwayat cuti sebelumnya.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function CutiAkademikPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const pernahCutiValue = watch("pernahCutiSebelumnya");

  const onSubmit = (data: FormValues) => {
    console.log(data);
    alert("Pengajuan berhasil dikirim (mock).");
    reset();
  };

  return (
    <FormLayout
      title="Cuti Akademik"
      description="Unduh formulir, lengkapi dan tanda tangani, lalu unggah bersama data berikut."
    >
      <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4 text-sm text-orange-900 space-y-2">
        <p className="font-semibold">Wajib dibaca sebelum mengisi</p>
        <p>
          Unduh formulir Cuti Akademik, lengkapi, lalu minta tanda tangan Pembimbing Akademik, orang tua,
          dan mahasiswa.
        </p>
        <a
          href="https://drive.google.com/file/d/1_vlQ42V3dAWVUxkwZXJMiJB1QQu8SrGJ/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand font-semibold underline underline-offset-4"
        >
          Unduh Formulir Cuti Akademik
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Nama Lengkap"
            required
            registration={register("namaLengkap")}
            error={errors.namaLengkap?.message}
          />
          <InputField
            label="NIM"
            required
            registration={register("nim")}
            error={errors.nim?.message}
          />
          <SelectField
            label="Jurusan"
            required
            registration={register("jurusan")}
            options={jurusanOptions}
            error={errors.jurusan?.message}
            placeholder="Pilih jurusan"
          />
          <InputField
            label="Tempat Lahir"
            required
            registration={register("tempatLahir")}
            error={errors.tempatLahir?.message}
          />
          <InputField
            label="Tanggal Lahir"
            type="date"
            required
            registration={register("tanggalLahir")}
            error={errors.tanggalLahir?.message}
          />
          <InputField
            label="Tanggal Pengajuan"
            type="date"
            required
            registration={register("tanggalPengajuan")}
            error={errors.tanggalPengajuan?.message}
          />
          <InputField
            label="Nomor Telepon"
            required
            registration={register("nomorTelepon")}
            error={errors.nomorTelepon?.message}
            placeholder="08xxxxxxxxxx"
          />
          <InputField
            label="Kode Pos"
            required
            registration={register("kodePos")}
            error={errors.kodePos?.message}
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
            label="Nama Orang Tua"
            registration={register("namaOrangTua")}
            error={errors.namaOrangTua?.message}
          />
          <InputField
            label="Pembimbing Akademik"
            required
            registration={register("pembimbingAkademik")}
            error={errors.pembimbingAkademik?.message}
          />
        </div>

        <TextareaField
          label="Alamat Rumah"
          required
          registration={register("alamatRumah")}
          error={errors.alamatRumah?.message}
          rows={3}
        />

        <RadioGroupField
          label="Pernah Cuti Sebelumnya?"
          required
          registration={register("pernahCutiSebelumnya")}
          options={pernahCutiOptions}
          error={errors.pernahCutiSebelumnya?.message}
        />

        {pernahCutiValue === "Sudah" && (
          <TextareaField
            label="Bila sudah pernah cuti, dilaksanakan pada semester apa dan TA berapa?"
            required
            registration={register("detailCutiSebelumnya")}
            error={errors.detailCutiSebelumnya?.message}
            rows={3}
          />
        )}

        <FileField
          label="Formulir Cuti Ditandatangani"
          required
          registration={register("formulirCutiDitandatangani")}
          error={errors.formulirCutiDitandatangani?.message as string | undefined}
          helperText="Unggah formulir yang telah ditandatangani (PDF atau gambar)."
          accept="application/pdf,image/*"
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
