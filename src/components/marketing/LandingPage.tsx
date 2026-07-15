import Image from "next/image";
import Link from "next/link";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import { Button } from "@/components/ui/Button";
import { BILLING_PLANS, formatMonthlyPrice } from "@/lib/billing";
import { BRAND, assetPath } from "@/lib/constants";
import { HeroPromoVideo } from "@/components/marketing/HeroPromoVideo";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: "sparkles",
    tone: "coral" as const,
    title: "AI Pattern Studio",
    description:
      "Turn ideas, photos, or plushie prompts into polished crochet patterns in minutes.",
    bg: "bg-stitch-peach/70",
  },
  {
    icon: "vision",
    tone: "muted" as const,
    title: "Vision Mode",
    description:
      "Scan your work-in-progress, catch missed stitches, and fix mistakes before they grow.",
    bg: "bg-purple-50",
  },
  {
    icon: "tutor",
    tone: "gold" as const,
    title: "Crochet Tutor",
    description:
      "Ask anything — abbreviations, techniques, row help — and get guidance that learns your style.",
    bg: "bg-amber-50",
  },
  {
    icon: "pattern",
    tone: "teal" as const,
    title: "Pattern Workspace",
    description:
      "Follow rows, edit notes, track progress, and pick up exactly where you left off.",
    bg: "bg-stitch-mint/70",
  },
  {
    icon: "yarn",
    tone: "teal" as const,
    title: "Yarn Vault",
    description:
      "Catalog your stash, get substitution ideas, and never buy the wrong skein twice.",
    bg: "bg-stitch-sky/60",
  },
  {
    icon: "users",
    tone: "coral" as const,
    title: "Maker Community",
    description:
      "Share WIPs, discover patterns, and connect with crocheters who get the frog-prince life.",
    bg: "bg-stitch-rose/50",
  },
] as const;

const STEPS = [
  {
    step: "01",
    title: "Sign up free",
    description: "Create your account in under a minute. No credit card required.",
  },
  {
    step: "02",
    title: "Start a project",
    description: "Generate a pattern, upload one you love, or pick a lesson to learn.",
  },
  {
    step: "03",
    title: "Stitch with confidence",
    description: "Track rows, scan your work, and get help whenever you hit a snag.",
  },
] as const;

function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stitch-border/70 bg-stitch-cream/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={BRAND.mark} alt="" width={36} height={36} />
          <span className="hidden font-semibold text-stitch-ink sm:inline">{BRAND.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-stitch-muted md:flex">
          <a href="#features" className="hover:text-stitch-coral">Features</a>
          <a href="#how-it-works" className="hover:text-stitch-coral">How it works</a>
          <a href="#pricing" className="hover:text-stitch-coral">Pricing</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button href="/auth/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button href="/auth/signup" size="sm">
            Stitch Your Itch
          </Button>
        </div>
      </div>
    </header>
  );
}

function LandingFooter() {
  return (
    <footer className="border-t border-stitch-border bg-stitch-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <Image src={BRAND.mark} alt="" width={32} height={32} />
          <div>
            <p className="font-semibold text-stitch-ink">{BRAND.name}</p>
            <p className="text-sm text-stitch-muted">{BRAND.secondaryTagline}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-stitch-muted">
          <Link href="/auth/signup" className="hover:text-stitch-coral">Sign up free</Link>
          <Link href="/auth/login" className="hover:text-stitch-coral">Log in</Link>
          <Link href="/marketplace" className="hover:text-stitch-coral">Marketplace</Link>
          <Link href="/social" className="hover:text-stitch-coral">Community</Link>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  const freePlan = BILLING_PLANS.find((plan) => plan.tierId === "free");
  const plusPlan = BILLING_PLANS.find((plan) => plan.tierId === "stitch_plus");

  return (
    <div className="min-h-dvh bg-stitch-cream">
      <LandingNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
          >
            <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-stitch-peach/60 blur-3xl" />
            <div className="absolute -right-16 top-20 h-80 w-80 rounded-full bg-stitch-mint/50 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-stitch-sky/40 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-stitch-pill border border-stitch-border bg-stitch-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-stitch-teal shadow-stitch-card">
                <StitchIcon name="sparkles" tone="teal" size={14} />
                Free to start · No credit card
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-stitch-ink sm:text-5xl lg:text-[3.4rem]">
                Crochet smarter.
                <span className="block text-stitch-coral">Stitch your itch.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-stitch-muted">
                {BRAND.name} is your AI-powered crochet companion — design patterns,
                track every row, scan your stitches, and get help when you need it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button href="/auth/signup" size="lg" className="shadow-stitch-floating">
                  Stitch Your Itch
                  <StitchIcon name="arrow-right" size={18} className="brightness-0 invert" />
                </Button>
                <Button href="#features" variant="secondary" size="lg">
                  See what you get
                </Button>
              </div>
              <p className="mt-4 text-sm text-stitch-muted">
                Join free today. Upgrade anytime for AI patterns and vision scanning.
              </p>
            </div>

            <HeroPromoVideo />
          </div>
        </section>

        {/* Trust strip */}
        <section className="border-y border-stitch-border bg-stitch-paper">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-8 sm:grid-cols-4 sm:px-6">
            {[
              { label: "AI patterns", value: "Create in minutes" },
              { label: "Row tracking", value: "Never lose your place" },
              { label: "Vision scan", value: "Catch mistakes early" },
              { label: "Free tier", value: "Start at $0" },
            ].map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <p className="text-sm font-semibold text-stitch-ink">{item.label}</p>
                <p className="mt-1 text-xs text-stitch-muted">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-stitch-ink sm:text-4xl">
              Everything you need to finish what you start
            </h2>
            <p className="mt-4 text-stitch-muted">
              From first chain to final weave-in, Stitch keeps your projects organized
              and your confidence high.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-stitch-lg border border-stitch-border bg-stitch-paper p-5 shadow-stitch-card transition-transform hover:-translate-y-1"
              >
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-stitch-md",
                    feature.bg,
                  )}
                >
                  <StitchIcon name={feature.icon} tone={feature.tone} size={24} />
                </div>
                <h3 className="text-lg font-semibold text-stitch-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stitch-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-y border-stitch-border bg-gradient-to-b from-stitch-peach/30 to-stitch-cream"
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-stitch-ink">Up and stitching in three steps</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-stitch-lg border border-stitch-border bg-stitch-paper p-6 shadow-stitch-card"
                >
                  <span className="text-3xl font-bold text-stitch-coral/40">{item.step}</span>
                  <h3 className="mt-3 text-lg font-semibold text-stitch-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-stitch-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-stitch-ink">Start free. Upgrade when you&apos;re ready.</h2>
            <p className="mt-4 text-stitch-muted">
              Sign up costs nothing. Stitch Plus and Vision unlock when you want more AI power.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2">
            {freePlan ? (
              <article className="rounded-stitch-lg border-2 border-stitch-coral bg-stitch-paper p-6 shadow-stitch-floating">
                <p className="text-sm font-semibold uppercase tracking-wide text-stitch-coral">
                  Most popular to start
                </p>
                <h3 className="mt-2 text-2xl font-bold text-stitch-ink">{freePlan.name}</h3>
                <p className="mt-1 text-3xl font-bold text-stitch-ink">
                  {formatMonthlyPrice(freePlan.monthlyPriceCents)}
                  <span className="text-base font-normal text-stitch-muted">/mo</span>
                </p>
                <p className="mt-2 text-sm text-stitch-muted">{freePlan.description}</p>
                <ul className="mt-5 space-y-2">
                  {freePlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-stitch-ink">
                      <StitchIcon name="check" tone="teal" size={16} className="mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button href="/auth/signup" className="mt-6 w-full" size="lg">
                  Stitch Your Itch — It&apos;s Free
                </Button>
              </article>
            ) : null}

            {plusPlan ? (
              <article className="rounded-stitch-lg border border-stitch-border bg-stitch-paper p-6 shadow-stitch-card">
                <p className="text-sm font-semibold uppercase tracking-wide text-stitch-muted">
                  When you want more
                </p>
                <h3 className="mt-2 text-2xl font-bold text-stitch-ink">{plusPlan.name}</h3>
                <p className="mt-1 text-3xl font-bold text-stitch-ink">
                  {formatMonthlyPrice(plusPlan.monthlyPriceCents)}
                  <span className="text-base font-normal text-stitch-muted">/mo</span>
                </p>
                <p className="mt-2 text-sm text-stitch-muted">{plusPlan.description}</p>
                <ul className="mt-5 space-y-2">
                  {plusPlan.features.slice(0, 5).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-stitch-ink">
                      <StitchIcon name="check" tone="teal" size={16} className="mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button href="/auth/signup" variant="secondary" className="mt-6 w-full" size="lg">
                  Start free, upgrade later
                </Button>
              </article>
            ) : null}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24">
          <div className="overflow-hidden rounded-stitch-xl border border-stitch-border bg-gradient-to-r from-stitch-coral to-stitch-coral-dark p-8 text-center shadow-stitch-floating sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Your next project is waiting
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/90">
              Stop scrolling patterns you&apos;ll never finish. Start one you&apos;ll love —
              with tools that help you every stitch of the way.
            </p>
            <Button
              href="/auth/signup"
              size="lg"
              className="mt-8 bg-white text-stitch-coral hover:bg-stitch-cream"
            >
              Stitch Your Itch
              <StitchIcon name="arrow-right" tone="coral" size={18} />
            </Button>
            <p className="mt-4 text-sm text-white/80">Free account · Takes less than a minute</p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
