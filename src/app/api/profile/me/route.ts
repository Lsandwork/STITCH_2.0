import { jsonError, jsonSuccess } from "@/lib/api-utils";
import { getServerAppUser } from "@/lib/app-user";

export async function GET() {
  const user = await getServerAppUser();
  if (!user) {
    return jsonError("Not signed in", 401);
  }

  return jsonSuccess({
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    adminRole: user.adminRole,
    subscriptionTier: user.subscriptionTier,
    lifetimeAccess: user.lifetimeAccess,
  });
}
