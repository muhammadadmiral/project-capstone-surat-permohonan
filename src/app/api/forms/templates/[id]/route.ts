import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  schema: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      type: z.string(),
      required: z.boolean().optional(),
      placeholder: z.string().optional(),
      options: z.array(z.string()).optional(),
      helperText: z.string().optional(),
    })
  ).optional(),
});

type ParamsPromise = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: ParamsPromise) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  const slugCandidates = Array.from(
    new Set([
      id,
      id.replace(/[-_]+/g, " ").trim(),
      id.replace(/\s+/g, "-").trim(),
    ].filter((value) => value.length > 0))
  );
  const template = await prisma.formTemplate.findFirst({
    where: {
      OR: [
        { id },
        ...slugCandidates.map((slug) => ({
          slug: { equals: slug, mode: "insensitive" },
        })),
      ],
    },
  });
  if (!template) return NextResponse.json({ error: "Template tidak ditemukan." }, { status: 404 });
  if (template.isActive === false && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Template tidak aktif." }, { status: 403 });
  }
  return NextResponse.json({ template });
}

export async function PATCH(req: NextRequest, context: ParamsPromise) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const payload = updateSchema.parse(await req.json());
    const template = await prisma.formTemplate.update({
      where: { id },
      data: payload,
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Update template error", error);
    return NextResponse.json({ error: "Gagal memperbarui template." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, context: ParamsPromise) {
  const { id } = await context.params;
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.formTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete template error", error);
    return NextResponse.json({ error: "Gagal menghapus template." }, { status: 400 });
  }
}
