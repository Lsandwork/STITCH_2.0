import type { createAdminClient } from "@/lib/supabase/admin";

type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;

export function isEmailNotConfirmedError(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("email not confirmed") ||
    normalized.includes("email_not_confirmed")
  );
}

export async function findAuthUserByEmail(
  adminClient: AdminClient,
  email: string,
) {
  const normalizedEmail = email.trim().toLowerCase();
  let page = 1;
  const perPage = 200;

  while (page <= 10) {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page,
      perPage,
    });

    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    );
    if (match) return match;

    if (data.users.length < perPage) break;
    page += 1;
  }

  return null;
}

export async function confirmUserEmail(
  adminClient: AdminClient,
  userId: string,
): Promise<void> {
  const { error } = await adminClient.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });

  if (error) {
    throw error;
  }
}
