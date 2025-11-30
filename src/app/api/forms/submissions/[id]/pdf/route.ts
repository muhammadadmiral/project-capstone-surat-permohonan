import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import PDFDocument from "pdfkit";

function renderPayload(doc: PDFKit.PDFDocument, payload: Record<string, any>) {
  Object.entries(payload).forEach(([key, value]) => {
    doc.text(`${key}: ${typeof value === "string" ? value : JSON.stringify(value)}`);
  });
}

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submission = await prisma.letterSubmission.findUnique({
    where: { id },
    include: { template: true, attachments: true },
  });

  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "ADMIN" && submission.createdById !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const buffer = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(16).text(submission.title, { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Template: ${submission.template.title}`);
    doc.text(`Status: ${submission.status}`);
    doc.text(`Dibuat: ${submission.createdAt.toISOString()}`);
    doc.text(`Diperbarui: ${submission.updatedAt.toISOString()}`);
    doc.moveDown();
    doc.text("Data Form:", { underline: true });
    renderPayload(doc, submission.payload as Record<string, any>);
    if (submission.notes) {
      doc.moveDown();
      doc.text("Catatan Admin:", { underline: true });
      doc.text(submission.notes);
    }
    if (submission.attachments.length > 0) {
      doc.moveDown();
      doc.text("Lampiran:", { underline: true });
      submission.attachments.forEach((att) => {
        doc.text(`${att.publicId} — ${att.url}`);
      });
    }
    doc.end();
  });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="surat-${params.id}.pdf"`,
    },
  });
}
