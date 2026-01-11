"use client";

import FormLayout from "@/components/forms/FormLayout";
import {
  InputField,
  RadioGroupField,
  SelectField,
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

const jenisSuratOptions = [
  { value: "Surat permohonan KP", label: "Surat permohonan KP" },
  { value: "Surat permohonan TA/Skripsi", label: "Surat permohonan TA/Skripsi" },
  { value: "Surat permohonan riset tugas kuliah", label: "Surat permohonan riset tugas kuliah" },
  { value: "Surat magang berdampak mandiri", label: "Surat magang berdampak mandiri" },
  { value: "Surat magang mandiri", label: "Surat magang mandiri" },
  { value: "Yang lain", label: "Yang lain" },
];

const keteranganOptions = [
  { value: "Revisi", label: "Revisi" },
  { value: "Surat sebelumnya ditolak", label: "Surat sebelumnya ditolak" },
  { value: "Pengajuan pertama", label: "Pengajuan pertama" },
  { value: "Yang lain", label: "Yang lain" },
];

const pengambilanOptions = [
  { value: "Ambil ke Fakultas", label: "Ambil ke Fakultas" },
  { value: "Kirim Email", label: "Kirim Email" },
];

const schema = z
  .object({
    namaMahasiswa1: z.string().min(1, "Nama mahasiswa 1 wajib diisi"),
    nimMahasiswa1: z.string().min(1, "NIM mahasiswa 1 wajib diisi"),
    namaMahasiswa2: z.string().optional(),
    nimMahasiswa2: z.string().optional(),
    email: z.string().email("Email tidak valid"),
    noHp: z.string().min(1, "Nomor HP wajib diisi"),
    prodi: z.enum([
      "S1 Sistem Informasi",
      "S1 Informatika",
      "D3 Informatika",
      "S1 Sains Data",
    ]),
    jenisSurat: z.enum([
      "Surat permohonan KP",
      "Surat permohonan TA/Skripsi",
      "Surat permohonan riset tugas kuliah",
      "Surat magang berdampak mandiri",
      "Surat magang mandiri",
      "Yang lain",
    ]),
    jenisSuratLainnya: z.string().optional(),
    namaPerusahaanInstansi: z.string().min(1, "Nama perusahaan/instansi wajib diisi"),
    suratDitujukanKepadaYth: z.string().min(1, "Tujuan surat wajib diisi"),
    judulKerjaPraktekAtauRisetTa: z.string().min(1, "Judul wajib diisi"),
    alamatPerusahaanInstansi: z.string().min(1, "Alamat instansi wajib diisi"),
    waktuKerjaPraktekAtauRiset: z.string().min(1, "Waktu pelaksanaan wajib diisi"),
    keterangan: z.enum(["Revisi", "Surat sebelumnya ditolak", "Pengajuan pertama", "Yang lain"]),
    keteranganLainnya: z.string().optional(),
    jenisPengambilanSurat: z.enum(["Ambil ke Fakultas", "Kirim Email"]),
  })
  .superRefine((values, ctx) => {
    if (values.jenisSurat === "Yang lain" && !values.jenisSuratLainnya?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["jenisSuratLainnya"],
        message: "Wajib diisi jika memilih opsi lain.",
      });
    }
    if (values.keterangan === "Yang lain" && !values.keteranganLainnya?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["keteranganLainnya"],
        message: "Wajib diisi jika memilih keterangan lain.",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export default function RisetKPMagangPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const jenisSuratValue = watch("jenisSurat");
  const keteranganValue = watch("keterangan");

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
      title="Surat Riset / KP / Magang Mandiri"
      description="Lengkapi data tim, tujuan surat, dan informasi instansi untuk pengajuan surat riset/KP/magang."
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Nama Mahasiswa 1"
            required
            registration={register("namaMahasiswa1")}
            error={errors.namaMahasiswa1?.message}
          />
          <InputField
            label="NIM Mahasiswa 1"
            required
            registration={register("nimMahasiswa1")}
            error={errors.nimMahasiswa1?.message}
          />
          <InputField
            label="Nama Mahasiswa 2 (opsional)"
            registration={register("namaMahasiswa2")}
            error={errors.namaMahasiswa2?.message}
          />
          <InputField
            label="NIM Mahasiswa 2 (opsional)"
            registration={register("nimMahasiswa2")}
            error={errors.nimMahasiswa2?.message}
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
            label="Nomor HP"
            required
            registration={register("noHp")}
            error={errors.noHp?.message}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <RadioGroupField
          label="Program Studi"
          required
          registration={register("prodi")}
          options={prodiOptions}
          error={errors.prodi?.message}
        />

        <SelectField
          label="Jenis Surat"
          required
          registration={register("jenisSurat")}
          options={jenisSuratOptions}
          error={errors.jenisSurat?.message}
          placeholder="Pilih jenis surat"
        />

        {jenisSuratValue === "Yang lain" && (
          <InputField
            label="Jenis Surat Lainnya"
            required
            registration={register("jenisSuratLainnya")}
            error={errors.jenisSuratLainnya?.message}
          />
        )}

        <InputField
          label="Nama Perusahaan / Instansi"
          required
          registration={register("namaPerusahaanInstansi")}
          error={errors.namaPerusahaanInstansi?.message}
        />

        <InputField
          label="Surat Ditujukan Kepada Yth."
          required
          registration={register("suratDitujukanKepadaYth")}
          error={errors.suratDitujukanKepadaYth?.message}
        />

        <InputField
          label="Judul Kerja Praktek / Riset / TA"
          required
          registration={register("judulKerjaPraktekAtauRisetTa")}
          error={errors.judulKerjaPraktekAtauRisetTa?.message}
        />

        <TextareaField
          label="Alamat Perusahaan / Instansi"
          required
          registration={register("alamatPerusahaanInstansi")}
          error={errors.alamatPerusahaanInstansi?.message}
          rows={4}
        />

        <InputField
          label="Waktu Kerja Praktek / Riset"
          required
          registration={register("waktuKerjaPraktekAtauRiset")}
          error={errors.waktuKerjaPraktekAtauRiset?.message}
          placeholder="Format: MM/YYYY s/d MM/YYYY"
        />

        <SelectField
          label="Keterangan"
          required
          registration={register("keterangan")}
          options={keteranganOptions}
          error={errors.keterangan?.message}
          placeholder="Pilih keterangan"
        />

        {keteranganValue === "Yang lain" && (
          <InputField
            label="Keterangan Lainnya"
            required
            registration={register("keteranganLainnya")}
            error={errors.keteranganLainnya?.message}
          />
        )}

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
