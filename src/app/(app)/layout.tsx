import { AppLayoutClient } from "@/components/stitch/AppLayoutClient";
import { getServerAppUser } from "@/lib/app-user";

export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerAppUser();

  return (
    <AppLayoutClient
      isAdmin={user?.adminRole === "admin"}
      initialSubscription={
        user
          ? {
              subscriptionTier: user.subscriptionTier,
              lifetimeAccess: user.lifetimeAccess,
            }
          : undefined
      }
    >
      {children}
    </AppLayoutClient>
  );
}
