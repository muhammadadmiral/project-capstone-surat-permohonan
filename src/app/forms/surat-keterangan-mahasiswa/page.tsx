"use client";

import FormLayout from "@/components/forms/FormLayout";
import {
  FileField,
  InputField,
  RadioGroupField,
  TextareaField,
} from "@/components/forms/fields";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const prodiOptions = [
  { value: "S1 Sistem Informasi", label: "S1 Sistem Informasi" },
  { value: "S1 Informatika", label: "S1 Informatika" },
  { value: "D3 Informatika", label: "D3 Informatika" },
  { value: "S1 Sains Data", label: "S1 Sains Data" },
];

const pengambilanOptions = [
  { value: "Ke Fakultas", label: "Ke Fakultas" },
  { value: "Dikirim Email", label: "Dikirim Email" },
];

const requiredFile = z.custom<FileList>(
  (files) => files instanceof FileList && files.length > 0,
  { message: "Unggah bukti pembayaran." }
);

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  namaMahasiswa: z.string().min(1, "Nama wajib diisi"),
  nim: z.string().min(1, "NIM wajib diisi"),
  tempatTanggalLahir: z.string().min(1, "Tempat/tanggal lahir wajib diisi"),
  namaOrtuWali: z.string().min(1, "Nama orang tua/wali wajib diisi"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  noHp: z.string().min(1, "Nomor HP wajib diisi"),
  prodi: z.enum([
    "S1 Sistem Informasi",
    "S1 Informatika",
    "D3 Informatika",
    "S1 Sains Data",
  ]),
  jenisSuratKeterangan: z.string().min(1, "Jenis surat keterangan wajib diisi"),
  kebutuhanSurat: z.string().min(1, "Kebutuhan surat wajib diisi"),
  pengambilanSurat: z.enum(["Ke Fakultas", "Dikirim Email"]),
  buktiPembayaran: requiredFile,
});

type FormValues = z.infer<typeof schema>;

export default function SuratKeteranganMahasiswaPage() {
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
      title="Surat Keterangan Mahasiswa"
      description="Isi data berikut untuk permohonan surat keterangan mahasiswa."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Email"
            type="email"
            required
            registration={register("email")}
            error={errors.email?.message}
            placeholder="nama@upnvj.ac.id"
          />
          <InputField
            label="Nama Mahasiswa"
            required
            registration={register("namaMahasiswa")}
            error={errors.namaMahasiswa?.message}
            placeholder="Nama lengkap"
          />
          <InputField
            label="NIM"
            required
            registration={register("nim")}
            error={errors.nim?.message}
            placeholder="NIM"
          />
          <InputField
            label="Tempat, Tanggal Lahir"
            required
            registration={register("tempatTanggalLahir")}
            error={errors.tempatTanggalLahir?.message}
            placeholder="Contoh: Jakarta, 01 Januari 2000"
          />
          <InputField
            label="Nama Orang Tua / Wali"
            required
            registration={register("namaOrtuWali")}
            error={errors.namaOrtuWali?.message}
          />
          <InputField
            label="Nomor HP"
            required
            registration={register("noHp")}
            error={errors.noHp?.message}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <TextareaField
          label="Alamat"
          required
          registration={register("alamat")}
          error={errors.alamat?.message}
          rows={4}
        />

        <RadioGroupField
          label="Program Studi"
          required
          registration={register("prodi")}
          options={prodiOptions}
          error={errors.prodi?.message}
        />

        <InputField
          label="Jenis Surat Keterangan"
          required
          registration={register("jenisSuratKeterangan")}
          error={errors.jenisSuratKeterangan?.message}
          placeholder="Surat keterangan aktif kuliah / lainnya"
        />

        <TextareaField
          label="Kebutuhan Surat"
          required
          registration={register("kebutuhanSurat")}
          error={errors.kebutuhanSurat?.message}
          rows={4}
          placeholder="Tuliskan kebutuhan atau tujuan surat"
        />

        <RadioGroupField
          label="Pengambilan Surat"
          required
          registration={register("pengambilanSurat")}
          options={pengambilanOptions}
          error={errors.pengambilanSurat?.message}
        />

        <FileField
          label="Bukti Pembayaran"
          required
          registration={register("buktiPembayaran")}
          error={errors.buktiPembayaran?.message as string | undefined}
          helperText="Unggah bukti pembayaran (foto atau PDF)."
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
