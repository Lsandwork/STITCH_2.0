"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { VaultYarn } from "@/services/yarnService";

type YarnCardProps = {
  yarn: VaultYarn;
  onDelete: (id: string) => Promise<void>;
};

export function YarnCard({ yarn, onDelete }: YarnCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Remove ${yarn.name} from your vault?`)) return;
    setDeleting(true);
    try {
      await onDelete(yarn.id);
    } finally {
      setDeleting(false);
    }
  }

  const swatchColor = yarn.colorHex ?? "#E8DFD1";

  return (
    <Card padding="md" className="flex h-full flex-col gap-3">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 h-12 w-12 shrink-0 rounded-full border border-stitch-border shadow-inner"
          style={{ backgroundColor: swatchColor }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-stitch-ink">{yarn.name}</h3>
              {yarn.brand ? (
                <p className="text-sm text-stitch-muted">{yarn.brand}</p>
              ) : null}
            </div>
            <Badge variant="teal">
              {yarn.quantitySkeins}{" "}
              {yarn.quantitySkeins === 1 ? "skein" : "skeins"}
            </Badge>
          </div>
        </div>
      </div>

      <dl className="grid gap-1 text-sm text-stitch-muted">
        {yarn.colorName ? (
          <div className="flex justify-between gap-3">
            <dt>Color</dt>
            <dd className="text-right text-stitch-ink">{yarn.colorName}</dd>
          </div>
        ) : null}
        {yarn.weight ? (
          <div className="flex justify-between gap-3">
            <dt>Weight</dt>
            <dd className="text-right text-stitch-ink">{yarn.weight}</dd>
          </div>
        ) : null}
        {yarn.fiberContent ? (
          <div className="flex justify-between gap-3">
            <dt>Fiber</dt>
            <dd className="text-right text-stitch-ink">{yarn.fiberContent}</dd>
          </div>
        ) : null}
        {yarn.recommendedHook ? (
          <div className="flex justify-between gap-3">
            <dt>Hook</dt>
            <dd className="text-right text-stitch-ink">{yarn.recommendedHook}</dd>
          </div>
        ) : null}
        {yarn.yardage ? (
          <div className="flex justify-between gap-3">
            <dt>Yardage</dt>
            <dd className="text-right text-stitch-ink">{yarn.yardage} yd</dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-auto flex justify-end pt-1">
        <Button
          variant="secondary"
          size="sm"
          disabled={deleting}
          onClick={handleDelete}
        >
          {deleting ? "Removing…" : "Remove"}
        </Button>
      </div>
    </Card>
  );
}
