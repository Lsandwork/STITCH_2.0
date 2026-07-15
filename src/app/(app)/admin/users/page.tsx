import { redirect } from "next/navigation";
import { AdminUsersClient } from "@/components/admin/AdminUsersClient";
import { getServerAppUser } from "@/lib/app-user";

export default async function AdminUsersPage() {
  const user = await getServerAppUser();

  if (!user || user.adminRole !== "admin") {
    redirect("/dashboard");
  }

  return <AdminUsersClient />;
}
