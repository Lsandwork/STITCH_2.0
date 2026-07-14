import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LoadingState } from "@/components/ui/LoadingState";
import { VocabClient } from "@/components/stitch/vocab/VocabClient";
import { getTermBySlug } from "@/data/vocabulary";

type VocabTermPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function VocabTermPage({ params }: VocabTermPageProps) {
  const { slug } = await params;
  const term = getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  return (
    <Suspense fallback={<LoadingState label="Loading vocabulary…" />}>
      <VocabClient initialSlug={slug} />
    </Suspense>
  );
}
