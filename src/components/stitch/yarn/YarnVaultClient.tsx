"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { YarnCard } from "@/components/stitch/yarn/YarnCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { StitchIcon } from "@/components/stitch/StitchIcon";
import type { VaultYarn } from "@/services/yarnService";

const LEGACY_STORAGE_KEY = "stitch-yarn-vault";

type LegacyYarn = {
  name?: string;
  brand?: string;
  colorName?: string;
  weight?: string;
  fiberContent?: string;
  recommendedHook?: string;
  quantitySkeins?: number;
};

type YarnVaultClientProps = {
  initialYarns: VaultYarn[];
  initialError?: string | null;
};

export function YarnVaultClient({
  initialYarns,
  initialError = null,
}: YarnVaultClientProps) {
  const [yarns, setYarns] = useState(initialYarns);
  const [loading, setLoading] = useState(
    initialYarns.length === 0 && !initialError,
  );
  const [error, setError] = useState<string | null>(initialError);

  const refreshYarns = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/yarn");
      const payload = (await response.json()) as {
        error?: string;
        yarns?: VaultYarn[];
      };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load your yarn stash.");
      }
      setYarns(payload.yarns ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your yarn stash.");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const migrateLegacyYarns = useCallback(async () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return;

    let legacyItems: LegacyYarn[] = [];
    try {
      legacyItems = JSON.parse(raw) as LegacyYarn[];
    } catch {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return;
    }

    if (!Array.isArray(legacyItems) || legacyItems.length === 0) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return;
    }

    const remaining: LegacyYarn[] = [];

    for (const item of legacyItems) {
      if (!item.name?.trim()) continue;
      try {
        const response = await fetch("/api/yarn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: item.name,
            brand: item.brand,
            colorName: item.colorName,
            weight: item.weight,
            fiberContent: item.fiberContent,
            recommendedHook: item.recommendedHook,
            quantitySkeins: item.quantitySkeins ?? 1,
          }),
        });
        if (!response.ok) {
          remaining.push(item);
        }
      } catch {
        remaining.push(item);
      }
    }

    if (remaining.length === 0) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(remaining));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      await migrateLegacyYarns();
      if (cancelled) return;
      await refreshYarns(initialYarns.length === 0);
    }

    void bootstrap();
    return () => {
      cancelled = true;
    };
  }, [initialYarns.length, migrateLegacyYarns, refreshYarns]);

  async function handleDelete(id: string) {
    const response = await fetch(`/api/yarn/${id}`, { method: "DELETE" });
    const payload = (await response.json()) as { error?: string };
    if (!response.ok) {
      throw new Error(payload.error ?? "Could not remove yarn.");
    }
    setYarns((current) => current.filter((yarn) => yarn.id !== id));
  }

  return (
    <>
      <PageHeading
        title="Yarn Vault"
        description="Track your stash, substitutions, and project recommendations."
        actionLabel="Add yarn"
        actionHref="/yarn/add"
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Button href="/yarn/substitute" variant="secondary">
          Substitute yarn
        </Button>
        <Button href="/yarn/recommendations" variant="secondary">
          Recommendations
        </Button>
      </div>

      {loading ? <LoadingState label="Loading your yarn stash…" /> : null}

      {!loading && error ? (
        <EmptyState
          icon={<StitchIcon name="yarn" tone="teal" size={28} />}
          title="Could not load your Yarn Vault"
          description={error}
          actionLabel="Try again"
          onAction={() => void refreshYarns(true)}
        />
      ) : null}

      {!loading && !error && yarns.length === 0 ? (
        <EmptyState
          icon={<StitchIcon name="yarn" tone="teal" size={28} />}
          title="Your Yarn Vault is empty"
          description="Add your first skein to track colors, weights, and get smart project ideas."
          actionLabel="Add yarn"
          actionHref="/yarn/add"
        />
      ) : null}

      {!loading && !error && yarns.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-stitch-muted">
            {yarns.length} yarn{yarns.length === 1 ? "" : "s"} saved to your account
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {yarns.map((yarn) => (
              <YarnCard key={yarn.id} yarn={yarn} onDelete={handleDelete} />
            ))}
          </div>
        </>
      ) : null}
    </>
  );
}
