import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const schemaField = z.object({
  id: z.string(),
  label: z.string(),
  type: z.string(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  helperText: z.string().optional(),
});

const templateSchema = z.object({
  slug: z.string().min(2),
  title: z.string().min(3),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  schema: z.array(schemaField),
});

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  const includeInactive = user?.role === "ADMIN";

  const templates = await prisma.formTemplate.findMany({
    where: includeInactive ? {} : { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ templates });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const payload = templateSchema.parse(await req.json());
    const template = await prisma.formTemplate.create({
      data: {
        slug: payload.slug,
        title: payload.title,
        description: payload.description,
        isActive: payload.isActive ?? true,
        schema: payload.schema,
        authorId: user.id,
      },
    });
    return NextResponse.json({ template });
  } catch (error) {
    console.error("Create template error", error);
    return NextResponse.json({ error: "Gagal membuat template." }, { status: 400 });
  }
}
