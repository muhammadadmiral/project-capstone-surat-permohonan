import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const submissionSchema = z.object({
  templateId: z.string(),
  title: z.string().min(3),
  payload: z.record(z.any()),
  notes: z.string().optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string(),
        format: z.string().optional(),
        bytes: z.number().optional(),
        width: z.number().optional(),
        height: z.number().optional(),
        type: z.string().optional(),
      })
    )
    .optional(),
});

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const submissions = await prisma.letterSubmission.findMany({
    where: user.role === "ADMIN" ? {} : { createdById: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      template: true,
      attachments: true,
    },
  });

  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = submissionSchema.parse(await req.json());
    const submission = await prisma.letterSubmission.create({
      data: {
        title: payload.title,
        payload: payload.payload,
        notes: payload.notes,
        templateId: payload.templateId,
        createdById: user.id,
        attachments: payload.attachments
          ? {
              create: payload.attachments.map((att) => ({
                url: att.url,
                publicId: att.publicId,
                format: att.format,
                bytes: att.bytes,
                width: att.width,
                height: att.height,
                type: att.type,
              })),
            }
          : undefined,
      },
      include: { template: true, attachments: true },
    });
    return NextResponse.json({ submission });
  } catch (error) {
    console.error("Create submission error", error);
    return NextResponse.json({ error: "Gagal mengirim surat." }, { status: 400 });
  }
}
