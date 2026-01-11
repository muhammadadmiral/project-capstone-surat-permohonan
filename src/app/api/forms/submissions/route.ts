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

    const normalizedAttachments =
      Array.isArray(attachments) && attachments.length > 0
        ? attachments
            .map((att: any) =>
              att && typeof att === "object" && typeof att.url === "string" && typeof att.publicId === "string"
                ? {
                    url: att.url,
                    publicId: att.publicId,
                    format: typeof att.format === "string" ? att.format : undefined,
                    bytes: typeof att.bytes === "number" ? att.bytes : undefined,
                    width: typeof att.width === "number" ? att.width : undefined,
                    height: typeof att.height === "number" ? att.height : undefined,
                    type: typeof att.type === "string" ? att.type : undefined,
                  }
                : null
            )
            .filter(Boolean)
        : undefined;

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
