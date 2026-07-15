/** Routes that keep seeded demo content to fill the UI. */
export const DEMO_CONTENT_PREFIXES = ["/social", "/marketplace"] as const;

export function isDemoContentRoute(pathname: string): boolean {
  return DEMO_CONTENT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
