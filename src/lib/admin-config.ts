export const ADMIN_BOOTSTRAP_EMAIL = "lsand.work@gmail.com";
export const ADMIN_BOOTSTRAP_PASSWORD = "password123";
export const ADMIN_BOOTSTRAP_DISPLAY_NAME = "Stitch Admin";

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
  if (isBootstrapAdminEmail(options.email)) return "admin";
  return "user";
}
