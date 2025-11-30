import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsPanel from "./SettingsPanel";

export default async function SettingsPage() {
  const user = await getUserFromCookies();
  if (!user) redirect("/login");

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <SettingsPanel currentUser={user} />
      </div>
    </main>
  );
}
