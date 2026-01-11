import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import PDFDocument from "pdfkit";

function buildPdfBuffer(letter: {
  id: string;
  title: string;
  type: string;
  status: string;
  studentName: string;
  nim: string;
  email: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(16).text("Surat Permohonan Akademik", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`ID Surat: ${letter.id}`);
    doc.text(`Judul: ${letter.title}`);
    doc.text(`Jenis: ${letter.type}`);
    doc.text(`Status: ${letter.status}`);
    doc.moveDown();
    doc.text(`Nama Mahasiswa: ${letter.studentName}`);
    doc.text(`NIM: ${letter.nim}`);
    doc.text(`Email: ${letter.email}`);
    if (letter.notes) {
      doc.moveDown();
      doc.text("Catatan:", { underline: true });
      doc.text(letter.notes);
    }
    doc.moveDown();
    doc.text(`Dibuat: ${letter.createdAt.toISOString()}`);
    doc.text(`Diperbarui: ${letter.updatedAt.toISOString()}`);

    doc.end();
  });
}

type ParamsPromise = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: ParamsPromise) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const letter = await prisma.letter.findUnique({
    where: { id },
  });

  if (!letter) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "ADMIN" && letter.createdById !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const buffer = await buildPdfBuffer(letter);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="surat-${id}.pdf"`,
    },
  });
}
