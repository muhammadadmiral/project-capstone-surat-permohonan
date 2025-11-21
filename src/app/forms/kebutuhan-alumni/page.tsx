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
  { value: "D3 Sistem Informasi", label: "D3 Sistem Informasi" },
  { value: "S1 Informatika", label: "S1 Informatika" },
  { value: "S1 Sistem Informasi", label: "S1 Sistem Informasi" },
];

const requiredFile = z.custom<FileList>(
  (files) => files instanceof FileList && files.length > 0,
  { message: "Unggah berkas ini." }
);

const schema = z.object({
  nim: z.string().min(1, "NIM wajib diisi"),
  namaLengkapSesuaiIjasah: z.string().min(1, "Nama wajib diisi"),
  programStudi: z.enum(["D3 Sistem Informasi", "S1 Informatika", "S1 Sistem Informasi"]),
  nomorTeleponAktif: z.string().min(1, "Nomor telepon wajib diisi"),
  email: z.string().email("Email tidak valid"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  keperluanJenisSurat: z.string().min(1, "Keperluan wajib diisi"),
  scanIjasah: requiredFile,
  transkipNilai: requiredFile,
  scanKtp: requiredFile,
  suratPermohonan: requiredFile,
});

type FormValues = z.infer<typeof schema>;

export default function KebutuhanAlumniPage() {
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
    alert("Permohonan terkirim. Terima kasih!");
    reset();
  };

  return (
    <FormLayout
      title="Layanan Alumni"
      description="Isi data dan unggah dokumen yang dibutuhkan untuk permohonan layanan alumni."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="NIM"
            required
            registration={register("nim")}
            error={errors.nim?.message}
          />
          <InputField
            label="Nama Lengkap (Sesuai Ijazah)"
            required
            registration={register("namaLengkapSesuaiIjasah")}
            error={errors.namaLengkapSesuaiIjasah?.message}
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
            label="Nomor Telepon Aktif"
            required
            registration={register("nomorTeleponAktif")}
            error={errors.nomorTeleponAktif?.message}
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
        </div>

        <TextareaField
          label="Alamat"
          required
          registration={register("alamat")}
          error={errors.alamat?.message}
          rows={4}
        />

        <TextareaField
          label="Keperluan / Jenis Surat"
          required
          registration={register("keperluanJenisSurat")}
          error={errors.keperluanJenisSurat?.message}
          rows={4}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label="Scan Ijazah"
            required
            registration={register("scanIjasah")}
            error={errors.scanIjasah?.message as string | undefined}
            helperText="Unggah salinan ijazah (gambar)."
            accept="image/*"
          />
          <FileField
            label="Transkip Nilai"
            required
            registration={register("transkipNilai")}
            error={errors.transkipNilai?.message as string | undefined}
            helperText="Unggah transkip nilai (gambar)."
            accept="image/*"
          />
          <FileField
            label="Scan KTP"
            required
            registration={register("scanKtp")}
            error={errors.scanKtp?.message as string | undefined}
            helperText="Unggah KTP (gambar)."
            accept="image/*"
          />
          <FileField
            label="Surat Permohonan"
            required
            registration={register("suratPermohonan")}
            error={errors.suratPermohonan?.message as string | undefined}
            helperText="Unggah surat permohonan (gambar)."
            accept="image/*"
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn btn-primary w-full">
            Kirim Permohonan
          </button>
        </div>
      </form>
    </FormLayout>
  );
}
