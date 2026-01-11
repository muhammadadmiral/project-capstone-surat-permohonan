import AdminDashboard from "./AdminDashboard";
import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getUserFromCookies();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <AdminDashboard currentUser={user} />
      </div>
    </main>
  );
}
