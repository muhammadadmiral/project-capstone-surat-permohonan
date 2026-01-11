import { getUserFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import TemplateSubmissionForm from "./TemplateSubmissionForm";

type PageProps = {
  params: { id: string };
};

export default async function DashboardFormDetailPage({ params }: PageProps) {
  const user = await getUserFromCookies();
  if (!user) redirect("/login");
  if (user.role === "ADMIN") redirect("/admin");

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <TemplateSubmissionForm templateKey={params.id} />
      </div>
    </main>
  );
}
