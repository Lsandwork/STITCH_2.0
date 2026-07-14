import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { getDemoLesson } from "@/lib/demo-data";

type Props = { params: Promise<{ lessonId: string }> };

export default async function LessonDetailPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = getDemoLesson(lessonId);

  if (!lesson) notFound();

  return (
    <>
      <PageHeading
        title={lesson.title}
        description={`${lesson.category} · ${lesson.durationMinutes} min lesson`}
        backHref="/learn"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card padding="lg">
          <div className="overflow-hidden rounded-stitch-lg bg-stitch-cream">
            <Image
              src={lesson.illustrationUrl}
              alt={`${lesson.title} crochet technique`}
              width={500}
              height={400}
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </Card>

        <div className="space-y-4">
          <Card padding="lg" className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="teal">{lesson.category}</Badge>
              <Badge>{lesson.durationMinutes} min</Badge>
            </div>
            <ProgressBar value={lesson.progressPercent} label="Your progress" />
          </Card>

          <Card padding="lg">
            <h3 className="mb-4 text-base font-semibold text-stitch-ink">
              Step-by-step
            </h3>
            <ol className="space-y-3">
              {lesson.steps.map((step, i) => (
                <li
                  key={step}
                  className="flex gap-3 text-sm leading-relaxed text-stitch-ink"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stitch-teal text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Card>

          <Card padding="md" className="border-stitch-teal/30 bg-stitch-mint/20">
            <p className="text-sm text-stitch-ink">
              <strong className="text-stitch-teal-dark">Tip:</strong> {lesson.tip}
            </p>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button href="/tutor">Ask Tutor</Button>
            <Button href="/workspace/demo-dachshund" variant="secondary">
              Practice in workspace
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
