import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { DEMO_LESSONS } from "@/lib/demo-data";

type Props = { params: Promise<{ lessonId: string }> };

export default async function LessonDetailPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = DEMO_LESSONS.find(
    (l) => l.slug === lessonId || l.id === lessonId,
  );

  if (!lesson) notFound();

  return (
    <>
      <PageHeading
        title={lesson.title}
        description={`${lesson.category} · ${lesson.durationMinutes} min lesson`}
        backHref="/learn"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card padding="lg">
          <div className="overflow-hidden rounded-stitch-lg bg-stitch-cream">
            <Image
              src={lesson.illustrationUrl}
              alt={lesson.title}
              width={500}
              height={400}
              className="aspect-[5/4] w-full object-cover"
            />
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <ProgressBar value={lesson.progressPercent} label="Your progress" />
          <div className="prose-sm space-y-3 text-sm text-stitch-ink">
            <p>
              Learn the fundamentals of <strong>{lesson.title.toLowerCase()}</strong> with
              step-by-step guidance from Stitch Tutor.
            </p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Watch the technique overview</li>
              <li>Practice with guided rows</li>
              <li>Apply it in your active project</li>
            </ol>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/tutor">Ask Tutor</Button>
            <Button href="/workspace/demo-dachshund" variant="secondary">
              Practice in workspace
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
