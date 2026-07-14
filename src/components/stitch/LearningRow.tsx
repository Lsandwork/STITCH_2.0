import Image from "next/image";
import Link from "next/link";
import type { DemoLesson } from "@/lib/demo-data";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StitchIcon } from "@/components/stitch/StitchIcon";

type LearningRowProps = {
  lessons: DemoLesson[];
  title?: string;
};

export function LearningRow({
  lessons,
  title = "Continue Learning",
}: LearningRowProps) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-stitch-ink">{title}</h2>
        <Link
          href="/learn"
          className="text-sm font-medium text-stitch-coral hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {lessons.map((lesson) => {
          const completed = lesson.progressPercent >= 100;
          const notStarted = lesson.progressPercent === 0;

          return (
            <Link
              key={lesson.id}
              href={lesson.href}
              className="stitch-card flex gap-3 p-3 transition-transform hover:-translate-y-0.5"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-stitch-md bg-stitch-cream">
                <Image
                  src={lesson.illustrationUrl}
                  alt={lesson.title}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
                {completed ? (
                  <span className="absolute inset-0 flex items-center justify-center bg-stitch-teal/20">
                    <StitchIcon name="check" tone="teal" size={22} />
                  </span>
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 text-sm font-semibold text-stitch-ink">
                    {lesson.title}
                  </h3>
                  {completed ? (
                    <Badge variant="success">Done</Badge>
                  ) : notStarted ? (
                    <Badge>Not started</Badge>
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-stitch-muted">
                  {lesson.category} · {lesson.durationMinutes} min
                </p>
                {!completed && !notStarted ? (
                  <div className="mt-2">
                    <ProgressBar value={lesson.progressPercent} size="sm" />
                  </div>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
