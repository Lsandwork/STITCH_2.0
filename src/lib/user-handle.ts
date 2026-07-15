/** Build a social handle from an email, e.g. cotoerika@yahoo.com → @cotoerika */
export function buildUserHandle(email: string): string {
  const local = email.split("@")[0]?.trim() || "maker";
  const sanitized = local.toLowerCase().replace(/[^a-z0-9_]/g, "_");
  return `@${sanitized || "maker"}`;
}
