import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "REJECTED", "SENT"]).optional(),
  notes: z.string().optional(),
});

type ParamsPromise = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: ParamsPromise) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const letter = await prisma.letter.findUnique({ where: { id } });
  if (!letter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role !== "ADMIN" && letter.createdById !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ letter });
}

export async function PATCH(req: NextRequest, context: ParamsPromise) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const payload = updateSchema.parse(await req.json());
    const letter = await prisma.letter.update({
      where: { id },
      data: {
        status: payload.status,
        notes: payload.notes,
      },
    });
    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Update letter error", error);
    return NextResponse.json({ error: "Gagal memperbarui surat." }, { status: 400 });
  }
}
