"use client";

import { useEffect, useState } from "react";
import { PageHeading } from "@/components/stitch/PageHeading";
import { GroupCard } from "@/components/stitch/social/GroupCard";
import { getSocialGroups } from "@/lib/social-storage";
import type { SocialGroup } from "@/lib/schemas/social";

export function SocialGroupsClient() {
  const [groups, setGroups] = useState<SocialGroup[]>([]);

  useEffect(() => {
    setGroups(getSocialGroups());
  }, []);

  function handleUpdate(updated: SocialGroup) {
    setGroups((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  const joined = groups.filter((g) => g.isJoined);
  const discover = groups.filter((g) => !g.isJoined);

  return (
    <>
      <PageHeading
        title="Groups"
        description="Join crochet communities — from amigurumi to garments to stash busting."
        backHref="/social"
      />

      {joined.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-stitch-ink">Your groups</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {joined.map((group) => (
              <GroupCard key={group.id} group={group} onUpdate={handleUpdate} />
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-stitch-ink">Discover groups</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discover.map((group) => (
            <GroupCard key={group.id} group={group} onUpdate={handleUpdate} />
          ))}
        </div>
      </section>
    </>
  );
}
