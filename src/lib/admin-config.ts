export const ADMIN_BOOTSTRAP_EMAIL =
  process.env.ADMIN_BOOTSTRAP_EMAIL ?? "lsand.work@gmail.com";

/** Prefer env; never ship a usable production default password. */
export const ADMIN_BOOTSTRAP_PASSWORD =
  process.env.ADMIN_BOOTSTRAP_PASSWORD ??
  (process.env.NODE_ENV === "production" ? "" : "password123");

export const ADMIN_BOOTSTRAP_DISPLAY_NAME =
  process.env.ADMIN_BOOTSTRAP_DISPLAY_NAME ?? "Stitch Admin";

export function isBootstrapAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_BOOTSTRAP_EMAIL.toLowerCase();
}

export function resolveAdminRole(options: {
  profileRole?: string | null;
  authRole?: string | null;
  email?: string | null;
}): "user" | "admin" {
  if (options.profileRole === "admin") return "admin";
  if (options.authRole === "admin") return "admin";
  // Email-only admin grant is limited to non-production to avoid privilege
  // escalation from a hardcoded address in the client bundle.
  if (
    process.env.NODE_ENV !== "production" &&
    isBootstrapAdminEmail(options.email)
  ) {
    return "admin";
  }
  return "user";
}
