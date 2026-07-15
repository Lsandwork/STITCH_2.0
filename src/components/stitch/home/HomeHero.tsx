import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { HOME_CATEGORIES } from "@/lib/home-patterns";
import { learnImage } from "@/lib/project-images";

const AVATARS = [
  "/assets/stitch/avatars/svg/avatar-1.svg",
  "/assets/stitch/avatars/svg/avatar-2.svg",
  "/assets/stitch/avatars/svg/avatar-4.svg",
  "/assets/stitch/avatars/svg/avatar-6.svg",
];

export function HomeHero() {
  return (
    <section className="border-b border-stitch-border bg-stitch-warm-white">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_1.1fr_0.95fr] lg:items-center lg:gap-6 lg:px-8 lg:py-12">
        {/* Left — messaging */}
        <div className="order-1 lg:order-none">
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-stitch-ink sm:text-5xl lg:text-[3.25rem]">
            Create more.
            <br />
            <em className="not-italic text-stitch-olive">Stitch</em> together.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-stitch-muted">
            Crochet, knit, embroider, and more.
            <br />
            Smart tools. Beautiful patterns.
            <br />
            A community that inspires.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href="/create/pattern" variant="olive" size="lg">
              Start Creating
            </Button>
            <Button href="/patterns" variant="secondary" size="lg">
              Explore Patterns
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {AVATARS.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border-2 border-stitch-warm-white bg-stitch-paper object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-stitch-muted">
              Loved by makers in Los Angeles and beyond.
            </p>
          </div>
        </div>

        {/* Center — hero image */}
        <div className="order-3 lg:order-none">
          <div className="relative mx-auto aspect-[3/4] max-w-[340px] overflow-hidden rounded-stitch-xl lg:max-w-none lg:aspect-[4/5]">
            <Image
              src={learnImage.grannySquareHoodie}
              alt="Maker working on a colorful crochet cardigan"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 340px, 420px"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stitch-warm-white/30 via-transparent to-transparent" />
          </div>
        </div>

        {/* Right — category card */}
        <div className="order-2 lg:order-none">
          <div className="rounded-stitch-lg border border-stitch-border bg-stitch-paper p-6 shadow-stitch-card">
            <h2 className="font-serif text-2xl font-semibold text-stitch-ink">
              What will you make today?
            </h2>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {HOME_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={
                    cat.id === "more"
                      ? "/marketplace"
                      : `/marketplace?craft=${cat.id}`
                  }
                  className="group flex flex-col items-center gap-2 text-center"
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${cat.color} transition-transform group-hover:scale-105`}
                  >
                    <StitchIcon name={cat.icon} tone="muted" size={22} />
                  </span>
                  <span className="text-xs font-medium text-stitch-ink">
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-stitch-border pt-5 sm:grid-cols-4">
              {[
                { label: "Patterns", value: "12" },
                { label: "Makers", value: "—" },
                { label: "Projects", value: "—" },
                { label: "Countries", value: "—" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-xl font-semibold text-stitch-ink">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-stitch-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
