import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

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
    const raw = (await req.json()) as Record<string, any>;

    if (!raw || typeof raw !== "object") {
      return NextResponse.json({ error: "Payload tidak valid" }, { status: 400 });
    }

    const { templateId, title, payload, notes, attachments } = raw;
    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json({ error: "Template tidak valid" }, { status: 400 });
    }
    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return NextResponse.json({ error: "Judul terlalu pendek" }, { status: 400 });
    }

    type AttachmentInput = {
      url: string;
      publicId: string;
      format?: string;
      bytes?: number;
      width?: number;
      height?: number;
      type?: string;
    };

    const attachmentsList = Array.isArray(attachments) ? attachments : [];
    const normalizedAttachments = attachmentsList.reduce<AttachmentInput[]>((acc, att) => {
      if (!att || typeof att !== "object") return acc;
      const candidate = att as Record<string, unknown>;
      if (typeof candidate.url !== "string" || typeof candidate.publicId !== "string") return acc;
      acc.push({
        url: candidate.url,
        publicId: candidate.publicId,
        format: typeof candidate.format === "string" ? candidate.format : undefined,
        bytes: typeof candidate.bytes === "number" ? candidate.bytes : undefined,
        width: typeof candidate.width === "number" ? candidate.width : undefined,
        height: typeof candidate.height === "number" ? candidate.height : undefined,
        type: typeof candidate.type === "string" ? candidate.type : undefined,
      });
      return acc;
    }, []);

    const submission = await prisma.letterSubmission.create({
      data: {
        title: title.trim(),
        payload: payload ?? {},
        notes: typeof notes === "string" ? notes : undefined,
        templateId,
        createdById: user.id,
        attachments:
          normalizedAttachments && normalizedAttachments.length > 0
            ? {
                create: normalizedAttachments,
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
