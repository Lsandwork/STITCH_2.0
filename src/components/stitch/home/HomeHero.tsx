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

function MakeTodayCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[24px] border border-white/55 bg-white/40 px-5 py-5 shadow-[0_12px_40px_rgba(52,43,35,0.08)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/35 sm:px-6 ${className}`}
    >
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

      <div className="mt-5 grid grid-cols-4 gap-2 border-t border-[#E8E0D6]/70 pt-4">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <StitchIcon name={stat.icon} tone="muted" size={14} />
            <p className="mt-1 text-xs font-semibold tracking-tight text-stitch-ink">
              {stat.value}
            </p>
            <p className="text-[9px] text-[#8A837B]">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-stitch-border bg-[#FAF7F2]">
      {/*
        Photo plate stays LEFT so Monstera + yarn frame the card.
        Cream dissolve owns the center-right — card sits on glass over cream,
        never as an opaque slab over photo subjects.
      */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,560px)] sm:w-[52%] lg:w-[46%] xl:w-[44%]"
        aria-hidden
      >
        <Image
          src="/assets/stitch/home/hero-still-life.jpg"
          alt=""
          fill
          priority
          className="object-cover object-[left_center]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 52vw, 46vw"
        />
        {/* Soft dissolve: crisp left subjects → cream before the card zone */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, transparent 18%, rgba(250,247,242,0.15) 32%, rgba(250,247,242,0.55) 52%, rgba(250,247,242,0.92) 72%, #FAF7F2 88%)",
          }}
        />
        <div className="absolute inset-y-0 right-0 w-[45%] bg-gradient-to-r from-transparent via-[#FAF7F2]/70 to-[#FAF7F2]" />
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#FAF7F2]/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#FAF7F2]/55 to-transparent" />
      </div>

      {/* Solid cream veil from mid-right so the glass card never sits on busy photo */}
      <div
        className="pointer-events-none absolute inset-y-0 left-[38%] right-0 sm:left-[42%] lg:left-[40%]"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(250,247,242,0.55) 12%, #FAF7F2 36%, #FAF7F2 100%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid min-h-[420px] max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:min-h-[500px] lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)] lg:gap-12 lg:px-10 lg:py-14">
        {/* Left copy — over the photo / early blend */}
        <div className="relative z-10 max-w-[360px]">
          <h1 className="font-serif text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.02em] text-stitch-ink sm:text-[2.85rem] lg:text-[3.15rem]">
            Create more.
            <br />
            <em className="font-script not-italic text-[1.15em] font-normal leading-none text-stitch-olive">
              Stitch
            </em>{" "}
            together.
          </h1>

          <p className="mt-4 max-w-[280px] text-[14px] leading-[1.55] text-[#6B6560]">
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
              className="rounded-full border-[#D8D0C6] bg-white/55 px-6 text-stitch-ink backdrop-blur-md hover:border-stitch-olive hover:text-stitch-olive"
            >
              Explore Patterns
            </Button>
          </div>

          <div className="mt-6">
            <p className="text-[13px] text-[#6B6560]">
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
                    className="h-7 w-7 rounded-full border-2 border-white bg-stitch-paper object-cover"
                  />
                ))}
              </div>
              <span className="ml-2 text-xs font-medium text-[#6B6560]">
                +12K
              </span>
            </div>
          </div>
        </div>

        {/* Glass card on cream/blend — right column, clear of plant + yarn */}
        <div className="relative z-10 w-full max-w-[440px] justify-self-start lg:justify-self-end lg:pr-2 xl:pr-6">
          <MakeTodayCard />
        </div>
      </div>
    </section>
  );
}
