import { MobileBottomNav } from "@/components/stitch/MobileBottomNav";
import { OfflineIndicator } from "@/components/stitch/OfflineIndicator";
import { HomeHeader } from "@/components/stitch/home/HomeHeader";

type HomeShellProps = {
  children: React.ReactNode;
  avatarUrl: string;
  displayName: string;
};

export function HomeShell({
  children,
  avatarUrl,
  displayName,
}: HomeShellProps) {
  return (
    <div className="min-h-dvh bg-stitch-warm-white">
      <OfflineIndicator />
      <HomeHeader avatarUrl={avatarUrl} displayName={displayName} />
      <main>{children}</main>
      <MobileBottomNav />
    </div>
  );
}
