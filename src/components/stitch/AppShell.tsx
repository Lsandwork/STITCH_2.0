import { Sidebar } from "@/components/stitch/Sidebar";
import { MobileBottomNav } from "@/components/stitch/MobileBottomNav";
import { OfflineIndicator } from "@/components/stitch/OfflineIndicator";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  rightRail?: React.ReactNode;
  className?: string;
  isAdmin?: boolean;
};

export function AppShell({
  children,
  rightRail,
  className,
  isAdmin = false,
}: AppShellProps) {
  return (
    <div className="min-h-dvh bg-stitch-cream">
      <OfflineIndicator />
      <Sidebar isAdmin={isAdmin} />

      <div className="stitch-main-shell">
        <div className="mx-auto flex w-full max-w-[1600px] gap-6">
          <main className={cn("stitch-page-content min-w-0 flex-1", className)}>
            {children}
          </main>

          {rightRail ? (
            <div className="hidden shrink-0 pr-6 pt-6 xl:block">{rightRail}</div>
          ) : null}
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
}
