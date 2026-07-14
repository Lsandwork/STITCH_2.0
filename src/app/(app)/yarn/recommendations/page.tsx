import Link from "next/link";
import Image from "next/image";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Card } from "@/components/ui/Card";
import { DEMO_RECOMMENDATIONS } from "@/lib/demo-data";

export default function YarnRecommendationsPage() {
  return (
    <>
      <PageHeading
        title="Yarn Recommendations"
        description="Projects and palettes matched to your stash."
        backHref="/yarn"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {DEMO_RECOMMENDATIONS.map((rec) => (
          <Link key={rec.id} href={rec.href}>
            <Card className="overflow-hidden transition-transform hover:-translate-y-0.5">
              <div className="aspect-[16/10] overflow-hidden bg-stitch-cream">
                <Image
                  src={rec.imageUrl}
                  alt={rec.title}
                  width={400}
                  height={250}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{rec.title}</h3>
                <p className="mt-1 text-sm text-stitch-muted">{rec.description}</p>
                <p className="mt-2 text-xs font-medium text-stitch-gold">{rec.reason}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
