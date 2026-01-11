"use client";

import FormLayout from "@/components/forms/FormLayout";
import {
  InputField,
  RadioGroupField,
  TextareaField,
} from "@/components/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const prodiOptions = [
  { value: "S1 Sistem Informasi", label: "S1 Sistem Informasi" },
  { value: "S1 Informatika", label: "S1 Informatika" },
  { value: "D3 Informatika", label: "D3 Informatika" },
  { value: "S1 Sains Data", label: "S1 Sains Data" },
];

const jenisKelaminOptions = [
  { value: "Laki-laki", label: "Laki-laki" },
  { value: "Perempuan", label: "Perempuan" },
];

const pengambilanOptions = [
  { value: "Ambil ke Fakultas", label: "Ambil ke Fakultas" },
  { value: "Kirim Email", label: "Kirim Email" },
];

const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  jenisKelamin: z.enum(["Laki-laki", "Perempuan"]),
  nim: z.string().min(1, "NIM wajib diisi"),
  prodi: z.enum([
    "S1 Sistem Informasi",
    "S1 Informatika",
    "D3 Informatika",
    "S1 Sains Data",
  ]),
  semesterAtauSks: z.string().min(1, "Semester/SKS wajib diisi"),
  tempatTanggalLahir: z.string().min(1, "Tempat/tanggal lahir wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  noHp: z.string().min(1, "Nomor HP wajib diisi"),
  instansiPenyediaBeasiswa: z.string().min(1, "Nama instansi wajib diisi"),
  periodeBeasiswa: z.string().min(1, "Periode beasiswa wajib diisi"),
  email: z.string().email("Email tidak valid"),
  jenisPengambilanSurat: z.enum(["Ambil ke Fakultas", "Kirim Email"]),
});

type FormValues = z.infer<typeof schema>;

export default function RekomendasiBeasiswaPage() {
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

  const onError = () => {
    toast.error("Form belum lengkap", {
      description: "Lengkapi semua field wajib sebelum mengirim.",
    });
  };

  return (
    <FormLayout
      title="Rekomendasi Beasiswa"
      description="Lengkapi data diri dan akademik untuk pengajuan rekomendasi beasiswa."
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
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
          <InputField
            label="Semester / SKS"
            required
            registration={register("semesterAtauSks")}
            error={errors.semesterAtauSks?.message}
            placeholder="Contoh: Semester 5 / 90 SKS"
          />
          <InputField
            label="Tempat, Tanggal Lahir"
            required
            registration={register("tempatTanggalLahir")}
            error={errors.tempatTanggalLahir?.message}
            placeholder="Contoh: Maklo, 02 Februari 2001"
          />
          <InputField
            label="Nomor HP"
            required
            registration={register("noHp")}
            error={errors.noHp?.message}
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
            label="Instansi Penyedia Beasiswa"
            required
            registration={register("instansiPenyediaBeasiswa")}
            error={errors.instansiPenyediaBeasiswa?.message}
          />
          <InputField
            label="Periode Beasiswa"
            required
            registration={register("periodeBeasiswa")}
            error={errors.periodeBeasiswa?.message}
            placeholder="Contoh: 2024/2025"
          />
        </div>

        <RadioGroupField
          label="Jenis Kelamin"
          required
          registration={register("jenisKelamin")}
          options={jenisKelaminOptions}
          error={errors.jenisKelamin?.message}
        />

        <RadioGroupField
          label="Program Studi"
          required
          registration={register("prodi")}
          options={prodiOptions}
          error={errors.prodi?.message}
        />

        <TextareaField
          label="Alamat"
          required
          registration={register("alamat")}
          error={errors.alamat?.message}
          rows={4}
        />

        <RadioGroupField
          label="Jenis Pengambilan Surat"
          required
          registration={register("jenisPengambilanSurat")}
          options={pengambilanOptions}
          error={errors.jenisPengambilanSurat?.message}
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
