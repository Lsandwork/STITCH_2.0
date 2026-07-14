import Link from "next/link";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DEMO_LESSONS } from "@/lib/demo-data";

export default function LearnPage() {
  return (
    <>
      <PageHeading
        title="Learn"
        description="Skill-building lessons from magic ring to advanced shaping."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_LESSONS.map((lesson) => (
          <Link key={lesson.id} href={lesson.href}>
            <article className="stitch-card flex gap-4 p-4 transition-transform hover:-translate-y-0.5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-stitch-md bg-stitch-cream">
                <Image
                  src={lesson.illustrationUrl}
                  alt={lesson.title}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-stitch-ink">{lesson.title}</h2>
                  {lesson.progressPercent >= 100 ? (
                    <Badge variant="success">Done</Badge>
                  ) : null}
                </div>
                <p className="text-sm text-stitch-muted">
                  {lesson.category} · {lesson.durationMinutes} min
                </p>
                {lesson.progressPercent > 0 && lesson.progressPercent < 100 ? (
                  <div className="mt-2">
                    <ProgressBar value={lesson.progressPercent} size="sm" />
                  </div>
                ) : null}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}
