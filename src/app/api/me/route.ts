import { getUserFromCookies } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  password: z
    .object({
      current: z.string().min(8, "Password minimal 8 karakter"),
      next: z
        .string()
        .min(8, "Password minimal 8 karakter")
        .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9])/, "Gunakan huruf besar, kecil, angka, dan simbol"),
    })
    .optional(),
});

export async function GET() {
  const user = await getUserFromCookies();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const session = await getUserFromCookies();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const payload = updateSchema.parse(await req.json());
    if (payload.password) {
      const dbUser = await prisma.user.findUnique({ where: { id: session.id } });
      if (!dbUser) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const valid = await compare(payload.password.current, dbUser.password);
      if (!valid) return NextResponse.json({ error: "Password lama salah." }, { status: 400 });
      const hashed = await hash(payload.password.next, 10);
      await prisma.user.update({ where: { id: session.id }, data: { password: hashed } });
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: payload.name,
        avatarUrl: payload.avatarUrl === undefined ? undefined : payload.avatarUrl,
      },
      select: { id: true, email: true, name: true, role: true, avatarUrl: true },
    });
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Update profile error", error);
    return NextResponse.json({ error: "Gagal memperbarui profil." }, { status: 400 });
  }
}
