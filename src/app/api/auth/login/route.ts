import { prisma } from "@/lib/prisma";
import { signSession, setAuthCookie } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { compare } from "bcryptjs";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }

    const token = await signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
    setAuthCookie(res, token);
    return res;
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ error: "Tidak dapat masuk sekarang." }, { status: 400 });
  }
}
