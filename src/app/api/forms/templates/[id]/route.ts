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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  const template = await prisma.formTemplate.findUnique({
    where: { id: params.id },
  });
  if (!template) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (template.isActive === false && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return NextResponse.json({ template });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const payload = updateSchema.parse(await req.json());
    const template = await prisma.formTemplate.update({
      where: { id: params.id },
      data: payload,
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Update template error", error);
    return NextResponse.json({ error: "Gagal memperbarui template." }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    await prisma.formTemplate.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete template error", error);
    return NextResponse.json({ error: "Gagal menghapus template." }, { status: 400 });
  }
}
