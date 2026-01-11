import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "MAHASISWA"]),
});

export async function POST(req: NextRequest) {
  const totalUsers = await prisma.user.count();
  const sessionUser = await getUserFromRequest(req);

  // Allow first user bootstrap without session; afterwards require admin
  if (totalUsers > 0 && (!sessionUser || sessionUser.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const payload = createUserSchema.parse(await req.json());
    const existing = await prisma.user.findUnique({
      where: { email: payload.email.toLowerCase() },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 });
    }

    const hashed = await hash(payload.password, 10);
    const user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: hashed,
        role: payload.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user, bootstrap: totalUsers === 0 });
  } catch (error) {
    console.error("Create user error", error);
    return NextResponse.json({ error: "Gagal membuat akun." }, { status: 400 });
  }
}
