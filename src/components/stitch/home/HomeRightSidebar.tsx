import Image from "next/image";
import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { POPULAR_TOOLS } from "@/lib/home-navigation";
import { projectImage } from "@/lib/project-images";

type HomeRightSidebarProps = {
  displayName: string;
};

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function HomeRightSidebar({ displayName }: HomeRightSidebarProps) {
  const firstName = displayName.split(" ")[0] ?? displayName;

  return (
    <aside className="space-y-5">
      {/* Welcome card */}
      <div className="rounded-stitch-lg border border-stitch-border bg-stitch-paper p-5 shadow-stitch-card">
        <h2 className="font-serif text-xl font-semibold text-stitch-ink">
          Welcome back, {firstName} ✨
        </h2>
        <div className="mt-4 flex items-center gap-2 text-sm text-stitch-muted">
          <StitchIcon name="sparkles" tone="gold" size={16} />
          <span>Keep your streak going</span>
        </div>
        <div className="mt-3 flex justify-between gap-1">
          {WEEK_DAYS.map((day, index) => (
            <div key={`${day}-${index}`} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-stitch-muted">{day}</span>
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  index < 5
                    ? "bg-stitch-olive/15 text-stitch-olive"
                    : "border border-stitch-border text-stitch-muted"
                }`}
                aria-hidden
              >
                {index < 5 ? (
                  <StitchIcon name="check" tone="muted" size={12} />
                ) : (
                  "·"
                )}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/dashboard"
          className="mt-4 inline-flex text-sm font-medium text-stitch-olive hover:underline"
        >
          View dashboard
        </Link>
      </div>

      {/* Community spotlight */}
      <div className="rounded-stitch-lg border border-stitch-border bg-stitch-paper p-4 shadow-stitch-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stitch-muted">
          Community Spotlight
        </h3>
        <Link href="/social" className="mt-3 block">
          <div className="flex items-center gap-2.5">
            <Image
              src="/assets/stitch/avatars/svg/avatar-2.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-stitch-ink">@StitchAndSage</p>
              <p className="text-xs text-stitch-muted">Finished Object · 2h ago</p>
            </div>
          </div>
          <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-stitch-md">
            <Image
              src={projectImage.sunflower}
              alt="Pink yarn crochet work in progress"
              fill
              className="object-cover"
              sizes="260px"
            />
          </div>
          <p className="mt-2 text-xs text-stitch-muted">
            #springcolors #crochet #handmade
          </p>
          <div className="mt-2 flex gap-4 text-xs text-stitch-muted">
            <span className="flex items-center gap-1">
              <StitchIcon name="heart" tone="muted" size={12} /> 128
            </span>
            <span className="flex items-center gap-1">
              <StitchIcon name="chat" tone="muted" size={12} /> 24
            </span>
          </div>
        </Link>
      </div>

      {/* Popular tools */}
      <div className="rounded-stitch-lg border border-stitch-border bg-stitch-paper p-4 shadow-stitch-card">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stitch-muted">
          Popular Tools
        </h3>
        <ul className="mt-2 divide-y divide-stitch-border">
          {POPULAR_TOOLS.map((tool) => (
            <li key={tool.label}>
              <Link
                href={tool.href}
                className="flex items-center justify-between py-2.5 text-sm text-stitch-ink transition-colors hover:text-stitch-olive"
              >
                <span className="flex items-center gap-2">
                  <StitchIcon name="sparkles" tone="muted" size={16} />
                  {tool.label}
                </span>
                <StitchIcon name="chevron-right" tone="muted" size={14} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
