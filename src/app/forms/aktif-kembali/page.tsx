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

const requiredFile = z.custom<FileList>(
  (files) => files instanceof FileList && files.length > 0,
  { message: "Unggah berkas ini." }
);

const schema = z.object({
  nim: z.string().min(1, "NIM wajib diisi"),
  namaLengkap: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  nomorTelepon: z.string().min(1, "Nomor telepon wajib diisi"),
  statusSemesterSebelumnya: z.string().min(1, "Status semester wajib diisi"),
  permohonan: z.enum(["Aktif Kembali"]),
  foto4x6: requiredFile,
  fotoKtm: requiredFile,
  suratPembayaranUangKuliah: requiredFile,
});

type FormValues = z.infer<typeof schema>;

export default function AktifKembaliPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { permohonan: "Aktif Kembali" },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    alert("Permohonan terkirim. Terima kasih!");
    reset({ permohonan: "Aktif Kembali" });
  };

  return (
    <FormLayout
      title="Aktif Kembali"
      description="Ajukan permohonan aktif kembali dengan melengkapi data dan unggahan dokumen."
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
            label="Nama Lengkap"
            required
            registration={register("namaLengkap")}
            error={errors.namaLengkap?.message}
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
            label="Nomor Telepon"
            required
            registration={register("nomorTelepon")}
            error={errors.nomorTelepon?.message}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <TextareaField
          label="Status Semester Sebelumnya"
          required
          registration={register("statusSemesterSebelumnya")}
          error={errors.statusSemesterSebelumnya?.message}
          helperText='Contoh: "Cuti Semester Genap TA. 2023/2024" atau "Non Aktif Semester Genap TA. 2023/2024"'
          rows={4}
        />

        <SelectField
          label="Permohonan"
          required
          registration={register("permohonan")}
          options={[{ value: "Aktif Kembali", label: "Aktif Kembali" }]}
          error={errors.permohonan?.message}
          placeholder="Pilih permohonan"
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FileField
            label="Foto 4x6"
            required
            registration={register("foto4x6")}
            error={errors.foto4x6?.message as string | undefined}
            helperText="Unggah foto terbaru ukuran 4x6."
            accept="image/*"
          />
          <FileField
            label="Foto KTM"
            required
            registration={register("fotoKtm")}
            error={errors.fotoKtm?.message as string | undefined}
            helperText="Unggah foto KTM."
            accept="image/*"
          />
          <FileField
            label="Surat Pembayaran Uang Kuliah"
            required
            registration={register("suratPembayaranUangKuliah")}
            error={errors.suratPembayaranUangKuliah?.message as string | undefined}
            helperText="Unggah bukti pembayaran uang kuliah."
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
