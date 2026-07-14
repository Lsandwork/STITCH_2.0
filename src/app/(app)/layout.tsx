import { AppLayoutClient } from "@/components/stitch/AppLayoutClient";

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayoutClient>{children}</AppLayoutClient>;
}
