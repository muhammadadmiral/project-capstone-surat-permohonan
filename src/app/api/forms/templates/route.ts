import defaultTemplatesData from "@/data/defaultTemplates.json";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest, type SessionUser } from "@/lib/auth";
import { hash } from "bcryptjs";
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

type DefaultTemplate = {
  slug: string;
  title: string;
  description?: string;
  isActive?: boolean;
  schema: Array<z.infer<typeof schemaField>>;
};

const defaultTemplates = defaultTemplatesData as DefaultTemplate[];

async function resolveAuthorId(user: SessionUser | null) {
  if (user) return user.id;
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" }, select: { id: true } });
  if (admin) return admin.id;
  const anyUser = await prisma.user.findFirst({ select: { id: true } });
  if (anyUser) return anyUser.id;

  const hashed = await hash("template-seeder", 10);
  const fallback = await prisma.user.create({
    data: {
      name: "Template Seeder",
      email: "template-seeder@system.local",
      password: hashed,
      role: "ADMIN",
      isActive: false,
    },
    select: { id: true },
  });
  return fallback.id;
}

async function ensureDefaultTemplates(authorId?: string) {
  if (!authorId) return;
  const existing = await prisma.formTemplate.findMany({
    where: { slug: { in: defaultTemplates.map((t) => t.slug) } },
    select: { slug: true },
  });
  const existingSlugs = new Set(existing.map((t: { slug: string }) => t.slug));
  const missing = defaultTemplates.filter((tpl) => !existingSlugs.has(tpl.slug));
  if (missing.length === 0) return;

  await prisma.formTemplate.createMany({
    data: missing.map((tpl) => ({
      slug: tpl.slug,
      title: tpl.title,
      description: tpl.description,
      isActive: tpl.isActive ?? true,
      schema: tpl.schema,
      authorId,
    })),
    skipDuplicates: true,
  });
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  const includeInactive = user?.role === "ADMIN";

  const authorId = await resolveAuthorId(user);
  await ensureDefaultTemplates(authorId);

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
