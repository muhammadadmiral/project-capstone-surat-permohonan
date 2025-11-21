"use client";

import FormLayout from "@/components/forms/FormLayout";
import {
  FileField,
  InputField,
  SelectField,
  TextareaField,
} from "@/components/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const programStudiOptions = [
  { value: "S1 Informatika", label: "S1 Informatika" },
  { value: "S1 Sistem Informasi", label: "S1 Sistem Informasi" },
  { value: "D3 Sistem Informasi", label: "D3 Sistem Informasi" },
];

const requiredFile = z.custom<FileList>(
  (files) => files instanceof FileList && files.length > 0,
  { message: "Unggah formulir pengunduran diri." }
);

const schema = z.object({
  namaLengkap: z.string().min(1, "Nama lengkap wajib diisi"),
  nim: z.string().min(1, "NIM wajib diisi"),
  programStudi: z.enum(["S1 Informatika", "S1 Sistem Informasi", "D3 Sistem Informasi"]),
  email: z.string().email("Email tidak valid"),
  noHpWa: z.string().min(1, "Nomor HP/WA wajib diisi"),
  alasanPengunduranDiri: z.string().min(1, "Alasan wajib diisi"),
  formulirPengunduranDiri: requiredFile,
});

type FormValues = z.infer<typeof schema>;

export default function PengunduranDiriPage() {
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
      title="Pengunduran Diri"
      description="Unduh, isi, dan tanda tangani formulir, lalu lengkapi data singkat untuk pencatatan."
    >
      <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4 text-sm text-orange-900 space-y-2">
        <p className="font-semibold">Panduan</p>
        <p>
          Unduh formulir, isi, dan lengkapi lampiran yang dipersyaratkan lalu ajukan ke fakultas serta temui admin
          (Mba Fitri).
        </p>
        <a
          href="https://drive.google.com/file/d/1RNB2C5Rwbryj_ut6S-ARu3phcY-0FJDv/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-brand font-semibold underline underline-offset-4"
        >
          Unduh Formulir Pengunduran Diri
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
            label="Program Studi"
            required
            registration={register("programStudi")}
            options={programStudiOptions}
            error={errors.programStudi?.message}
            placeholder="Pilih program studi"
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
            label="No. HP / WA"
            required
            registration={register("noHpWa")}
            error={errors.noHpWa?.message}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <TextareaField
          label="Alasan Pengunduran Diri"
          required
          registration={register("alasanPengunduranDiri")}
          error={errors.alasanPengunduranDiri?.message}
          rows={4}
        />

        <FileField
          label="Formulir Pengunduran Diri"
          required
          registration={register("formulirPengunduranDiri")}
          error={errors.formulirPengunduranDiri?.message as string | undefined}
          helperText="Unggah formulir yang telah diisi (PDF atau gambar)."
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
