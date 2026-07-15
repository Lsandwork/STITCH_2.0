import { redirect } from "next/navigation";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";
import { getServerAppUser } from "@/lib/app-user";

export default async function AdminSettingsPage() {
  const user = await getServerAppUser();

  if (!user || user.adminRole !== "admin") {
    redirect("/dashboard");
  }

  return <AdminSettingsClient />;
}
