import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function FormsLayout({ children }: { children: React.ReactNode }) {
  const user = await getUserFromCookies();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  return <>{children}</>;
}
