import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { HOME_CATEGORIES } from "@/lib/home-patterns";

const AVATARS = [
  "/assets/stitch/avatars/svg/avatar-1.svg",
  "/assets/stitch/avatars/svg/avatar-2.svg",
  "/assets/stitch/avatars/svg/avatar-3.svg",
  "/assets/stitch/avatars/svg/avatar-4.svg",
  "/assets/stitch/avatars/svg/avatar-6.svg",
];

const HERO_STATS = [
  { label: "Patterns", value: "25K+", icon: "heart" },
  { label: "Makers", value: "12K+", icon: "users" },
  { label: "Projects", value: "8K+", icon: "yarn" },
  { label: "Countries", value: "50+", icon: "globe" },
] as const;

const CATEGORY_STYLES: Record<string, string> = {
  crochet: "bg-[#F6D4D8]",
  knitting: "bg-[#D9D6F0]",
  embroidery: "bg-[#D5E8DC]",
  weaving: "bg-[#F3D9C4]",
  "punch-needle": "bg-[#E9CFD6]",
  more: "bg-[#E8E3D4]",
};

function MakeTodayCard() {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/70 px-5 py-5 shadow-[0_12px_40px_rgba(52,43,35,0.1)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/55 sm:px-6">
      <h2 className="font-serif text-[1.45rem] font-semibold leading-snug text-stitch-ink sm:text-[1.6rem]">
        What will you make today?
      </h2>

      <div className="mt-5 flex items-start justify-between gap-1">
        {HOME_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.id === "more" ? "/learn" : `/marketplace?craft=${cat.id}`}
            className="group flex w-[56px] flex-col items-center gap-1.5 text-center"
          >
            <span
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${CATEGORY_STYLES[cat.id] ?? cat.color}`}
            >
              <StitchIcon name={cat.icon} tone="default" size={18} />
            </span>
            <span className="text-[10px] font-medium leading-tight text-stitch-ink">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-4 gap-2 border-t border-stitch-border/70 pt-4">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <StitchIcon name={stat.icon} tone="muted" size={14} />
            <p className="mt-1 text-xs font-semibold tracking-tight text-stitch-ink">
              {stat.value}
            </p>
            <p className="text-[9px] text-stitch-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="dashboard-hero border-b border-stitch-border">
      {/* Absolute background plate — out of flow; section height comes from content only */}
      <div aria-hidden="true" className="dashboard-hero-image-layer">
        <Image
          src="/assets/stitch/home/hero-lifestyle.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="dashboard-hero-image"
        />
        <div className="dashboard-hero-fade" />
      </div>

      <div className="dashboard-hero-content mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] lg:gap-10 lg:px-10 lg:py-14">
        <div className="relative z-10 max-w-[380px]">
          <h1 className="font-serif text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.02em] text-stitch-ink sm:text-[2.85rem] lg:text-[3.25rem]">
            Create more.
            <br />
            <em className="font-script not-italic text-[1.15em] font-normal leading-none text-stitch-olive">
              Stitch
            </em>{" "}
            together.
          </h1>

          <p className="mt-4 max-w-[280px] text-[14px] leading-[1.55] text-stitch-muted">
            Crochet, knit, embroider, and more.
            <br />
            Smart tools. Beautiful patterns.
            <br />
            A community that inspires.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              href="/create/pattern"
              variant="olive"
              size="md"
              className="rounded-full px-6"
            >
              Start Creating
            </Button>
            <Button
              href="/learn"
              variant="secondary"
              size="md"
              className="rounded-full border-stitch-border bg-stitch-paper/85 px-6 text-stitch-ink backdrop-blur-sm hover:border-stitch-olive hover:text-stitch-olive"
            >
              Explore Patterns
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-[13px] text-stitch-muted">
              Loved by makers in Los Angeles and beyond.
            </p>
            <div className="mt-2.5 flex items-center">
              <div className="flex -space-x-2">
                {AVATARS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full border-2 border-stitch-paper bg-stitch-paper object-cover"
                  />
                ))}
              </div>
              <span className="ml-2 text-xs font-medium text-stitch-muted">
                +12K
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-[440px] justify-self-start lg:justify-self-end lg:pr-2 xl:pr-4">
          <MakeTodayCard />
        </div>
      </div>
    </section>
  );
}
