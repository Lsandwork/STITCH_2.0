import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeading } from "@/components/stitch/PageHeading";
import { MarkdownContent } from "@/components/stitch/patterns/MarkdownContent";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import {
  getLearnItemAsync,
  type StitchOriginalLearnItem,
} from "@/lib/learn-content";
import { getAllPatternSlugs } from "@/lib/patterns/catalog";
import { PATTERN_KITS } from "@/lib/pattern-kits";
import { DEMO_LESSONS } from "@/lib/demo-data";

type Props = { params: Promise<{ lessonId: string }> };

export function generateStaticParams() {
  return [
    ...getAllPatternSlugs().map((slug) => ({ lessonId: slug })),
    ...PATTERN_KITS.map((kit) => ({ lessonId: kit.slug })),
    ...DEMO_LESSONS.map((lesson) => ({ lessonId: lesson.slug })),
  ];
}

function isStitchOriginal(
  item: Awaited<ReturnType<typeof getLearnItemAsync>>,
): item is StitchOriginalLearnItem {
  return item?.kind === "stitch_original";
}

export default async function LessonDetailPage({ params }: Props) {
  const { lessonId } = await params;
  const item = await getLearnItemAsync(lessonId);

  if (!item) notFound();

  const isKit = item.kind === "pattern_kit" || item.kind === "stitch_original";
  const isOriginal = isStitchOriginal(item);

  return (
    <>
      <PageHeading
        title={item.title}
        description={
          isKit
            ? `${item.subtitle} · ${item.durationMinutes} min project`
            : `${item.category} · ${item.durationMinutes} min lesson`
        }
        backHref="/learn"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <Card padding="lg">
          <div className="overflow-hidden rounded-stitch-lg bg-stitch-cream">
            <Image
              src={item.illustrationUrl}
              alt={item.title}
              width={600}
              height={480}
              className="aspect-[5/4] w-full object-cover"
              priority
            />
          </div>
          {isKit ? (
            <p className="mt-3 text-center text-xs text-stitch-muted">
              Finished size: {item.finishedSize}
            </p>
          ) : null}
        </Card>

        <div className="space-y-4">
          <Card padding="lg" className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {isKit ? (
                <>
                  <Badge variant="gold">
                    {isOriginal ? "Stitch Original" : "Pattern Kit"}
                  </Badge>
                  <Badge variant="teal">{item.skillLevel}</Badge>
                  <Badge>{item.category}</Badge>
                </>
              ) : (
                <>
                  <Badge variant="teal">{item.category}</Badge>
                  <Badge>{item.durationMinutes} min</Badge>
                </>
              )}
            </div>
            <ProgressBar value={item.progressPercent} label="Your progress" />
          </Card>

          {isKit ? (
            <>
              <Card padding="lg" className="space-y-4">
                <h3 className="text-base font-semibold text-stitch-ink">
                  Yarn & materials
                </h3>
                <div className="rounded-stitch-md border border-stitch-border bg-stitch-cream/60 px-4 py-3 text-sm">
                  <p className="font-medium text-stitch-ink">Yarn needed</p>
                  <p className="mt-1 text-stitch-muted">{item.yarnSummary}</p>
                  <p className="mt-3 font-medium text-stitch-ink">Hook</p>
                  <p className="mt-1 text-stitch-muted">{item.hookSize}</p>
                </div>
                <ul className="space-y-2 text-sm text-stitch-ink">
                  {item.materials.map((material) => (
                    <li
                      key={material.item}
                      className="flex items-start justify-between gap-4 border-b border-stitch-border/60 pb-2 last:border-0 last:pb-0"
                    >
                      <span>{material.item}</span>
                      <span className="shrink-0 text-right text-stitch-muted">
                        {material.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card padding="lg">
                <h3 className="mb-3 text-base font-semibold text-stitch-ink">
                  Before you start
                </h3>
                <ul className="space-y-2 text-sm leading-relaxed text-stitch-muted">
                  {item.overview.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="text-stitch-teal">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : null}

          {isOriginal ? (
            <>
              <Card padding="lg">
                <h3 className="mb-4 text-base font-semibold text-stitch-ink">
                  Full pattern instructions
                </h3>
                <MarkdownContent content={item.fullInstructionsMarkdown} />
              </Card>

              <Card padding="lg">
                <h3 className="mb-4 text-base font-semibold text-stitch-ink">
                  Maker checklist
                </h3>
                <MarkdownContent content={item.checklistMarkdown} />
              </Card>
            </>
          ) : (
            <Card padding="lg">
              <h3 className="mb-4 text-base font-semibold text-stitch-ink">
                {isKit ? "Step-by-step instructions" : "Step-by-step"}
              </h3>
              <ol className="space-y-3">
                {item.steps.map((step, i) => (
                  <li
                    key={step}
                    className="flex gap-3 text-sm leading-relaxed text-stitch-ink"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stitch-teal text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}

          <Card padding="md" className="border-stitch-teal/30 bg-stitch-mint/20">
            <p className="text-sm text-stitch-ink">
              <strong className="text-stitch-teal-dark">Tip:</strong> {item.tip}
            </p>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button href="/tutor">Ask Tutor</Button>
            {isKit ? (
              <Button href="/yarn" variant="secondary">
                Check yarn vault
              </Button>
            ) : (
              <Button href="/workspace/demo-dachshund" variant="secondary">
                Practice in workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
