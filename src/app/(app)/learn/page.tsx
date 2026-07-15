import Link from "next/link";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { DEMO_LESSONS } from "@/lib/demo-data";
import { PATTERN_KITS } from "@/lib/pattern-kits";

function formatDuration(minutes: number): string {
  if (minutes >= 120) {
    const hours = Math.round(minutes / 60);
    return `${hours} hr${hours === 1 ? "" : "s"}`;
  }
  return `${minutes} min`;
}

function skillBadgeVariant(
  level: "beginner" | "intermediate" | "advanced",
): "teal" | "gold" | "default" {
  if (level === "beginner") return "teal";
  if (level === "advanced") return "gold";
  return "default";
}

export default function LearnPage() {
  return (
    <>
      <PageHeading
        title="Learn"
        description="Complete pattern kits with yarn guides and step-by-step instructions, plus technique lessons."
      />

      <section className="mb-10">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stitch-ink">Pattern Kits</h2>
            <p className="text-sm text-stitch-muted">
              High-grade projects with materials lists, yardage, and clear build steps.
            </p>
          </div>
          <Badge variant="gold">{PATTERN_KITS.length} kits</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PATTERN_KITS.map((kit) => (
            <Link key={kit.id} href={kit.href}>
              <article className="stitch-card group overflow-hidden transition-transform hover:-translate-y-0.5">
                <div className="relative aspect-[16/10] overflow-hidden bg-stitch-cream">
                  <Image
                    src={kit.illustrationUrl}
                    alt={kit.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-semibold text-stitch-ink">{kit.title}</h3>
                    <Badge variant="gold">Pattern Kit</Badge>
                  </div>
                  <p className="text-sm text-stitch-muted">{kit.subtitle}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-stitch-muted">
                    <Badge variant={skillBadgeVariant(kit.skillLevel)}>
                      {kit.skillLevel}
                    </Badge>
                    <span>{formatDuration(kit.durationMinutes)}</span>
                    <span>·</span>
                    <span>{kit.yarnSummary.split(" total")[0]}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stitch-ink">Technique Lessons</h2>
          <p className="text-sm text-stitch-muted">
            Short skill drills from magic ring to advanced shaping.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_LESSONS.map((lesson) => (
            <Link key={lesson.id} href={lesson.href}>
              <article className="stitch-card flex gap-4 p-4 transition-transform hover:-translate-y-0.5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-stitch-md bg-stitch-cream sm:h-28 sm:w-28">
                  <Image
                    src={lesson.illustrationUrl}
                    alt={`${lesson.title} crochet technique`}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-stitch-ink">{lesson.title}</h3>
                    <Badge>Lesson</Badge>
                  </div>
                  <p className="text-sm text-stitch-muted">
                    {lesson.category} · {lesson.durationMinutes} min
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
