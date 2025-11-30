import { getUserFromCookies } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getUserFromCookies();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
