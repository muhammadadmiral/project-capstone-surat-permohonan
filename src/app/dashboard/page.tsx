import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentDashboard from "./StudentDashboard";

export default async function DashboardPage() {
  const user = await getUserFromCookies();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-10">
        <StudentDashboard currentUser={user} />
      </div>
    </main>
  );
}
