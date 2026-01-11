import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

const createLetterSchema = z.object({
  title: z.string().min(3),
  type: z.string().min(2),
  studentName: z.string().min(2),
  nim: z.string().min(3),
  email: z.string().email(),
  notes: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const letters = await prisma.letter.findMany({
    where: user.role === "ADMIN" ? {} : { createdById: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ letters });
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = createLetterSchema.parse(await req.json());
    const jsonPayload = payload.payload as JsonValue | undefined;
    const letter = await prisma.letter.create({
      data: {
        ...payload,
        email: payload.email.toLowerCase(),
        payload: jsonPayload,
        createdById: user.id,
      },
    });

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("Create letter error", error);
    return NextResponse.json({ error: "Gagal membuat surat." }, { status: 400 });
  }
}
