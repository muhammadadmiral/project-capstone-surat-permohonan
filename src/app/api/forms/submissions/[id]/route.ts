import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED", "SENT", "CANCELLED"]).optional(),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submission = await prisma.letterSubmission.findUnique({
    where: { id: params.id },
    include: { template: true, attachments: true },
  });
  if (!submission) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (user.role !== "ADMIN" && submission.createdById !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ submission });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const payload = updateSchema.parse(await req.json());
    const submission = await prisma.letterSubmission.update({
      where: { id: params.id },
      data: payload,
      include: { template: true, attachments: true },
    });
    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Update submission error", error);
    return NextResponse.json({ error: "Gagal memperbarui surat." }, { status: 400 });
  }
}
