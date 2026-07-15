"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { PageHeading } from "@/components/stitch/PageHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { SubscriptionTier } from "@/types/database";

type AdminUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  accountType: "user" | "admin";
  tier: SubscriptionTier;
  status: string;
  lifetimeAccess: boolean;
  createdAt: string;
};

type ActivityItem = {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  activityType: string;
  label: string;
  payload: Record<string, unknown>;
  createdAt: string;
};

const TIER_OPTIONS: SubscriptionTier[] = ["free", "stitch_plus", "stitch_vision"];

export function AdminUsersClient() {
  const [tab, setTab] = useState<"users" | "activity">("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  async function loadUsers() {
    const response = await fetch("/api/admin/users");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Failed to load users");
    setUsers(data.users ?? []);
  }

  async function loadActivity() {
    const response = await fetch("/api/admin/activity");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Failed to load activity");
    setActivity(data.activity ?? []);
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadUsers(), loadActivity()]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  async function updateUser(
    userId: string,
    patch: {
      tier?: SubscriptionTier;
      lifetimeAccess?: boolean;
      adminRole?: "user" | "admin";
    },
  ) {
    setSavingUserId(userId);
    setError(null);
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...patch }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to update user");
      await Promise.all([loadUsers(), loadActivity()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setSavingUserId(null);
    }
  }

  return (
    <>
      <PageHeading
        title="Users"
        description="Manage accounts, access levels, and review user activity."
        backHref="/dashboard"
      />

      <div className="mb-6 flex gap-2 rounded-stitch-lg border border-stitch-border bg-stitch-paper p-1">
        {[
          { id: "users" as const, label: "Users" },
          { id: "activity" as const, label: "User Activity" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "flex-1 rounded-stitch-md px-4 py-2.5 text-sm font-medium transition-colors",
              tab === item.id
                ? "bg-stitch-coral text-white"
                : "text-stitch-muted hover:bg-stitch-peach/60 hover:text-stitch-ink",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error ? (
        <Card padding="md" className="mb-4 border-stitch-coral/30 bg-stitch-rose/40 text-sm text-stitch-coral">
          {error}
        </Card>
      ) : null}

      {loading ? (
        <p className="text-sm text-stitch-muted">Loading admin data…</p>
      ) : tab === "users" ? (
        <div className="space-y-4">
          {users.map((user) => (
            <Card key={user.id} padding="lg" className="overflow-hidden">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <Image
                    src={user.avatarUrl ?? "/assets/stitch/avatars/svg/avatar-1.svg"}
                    alt={user.displayName}
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-full border border-stitch-border object-cover"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-stitch-ink">{user.displayName}</h3>
                      <Badge variant={user.accountType === "admin" ? "gold" : "default"}>
                        {user.accountType === "admin" ? "Admin" : "User"}
                      </Badge>
                      {user.lifetimeAccess ? (
                        <Badge variant="teal">Lifetime access</Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-stitch-muted">{user.email}</p>
                    <p className="mt-1 text-xs text-stitch-muted">
                      Joined {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <label className="text-sm text-stitch-muted">
                    Access
                    <select
                      className="mt-1 block w-full min-w-[160px] rounded-stitch-sm border border-stitch-border bg-stitch-paper px-3 py-2 text-sm"
                      value={user.tier}
                      disabled={savingUserId === user.id}
                      onChange={(event) =>
                        void updateUser(user.id, {
                          tier: event.target.value as SubscriptionTier,
                        })
                      }
                    >
                      {TIER_OPTIONS.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm text-stitch-muted">
                    Account type
                    <select
                      className="mt-1 block w-full min-w-[140px] rounded-stitch-sm border border-stitch-border bg-stitch-paper px-3 py-2 text-sm"
                      value={user.accountType}
                      disabled={savingUserId === user.id}
                      onChange={(event) =>
                        void updateUser(user.id, {
                          adminRole: event.target.value as "user" | "admin",
                        })
                      }
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>

                  <Button
                    variant={user.lifetimeAccess ? "secondary" : "primary"}
                    size="sm"
                    disabled={savingUserId === user.id}
                    onClick={() =>
                      void updateUser(user.id, {
                        lifetimeAccess: !user.lifetimeAccess,
                      })
                    }
                  >
                    {user.lifetimeAccess ? "Revoke lifetime" : "Grant lifetime"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-stitch-border bg-stitch-cream/70 text-xs uppercase tracking-wide text-stitch-muted">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Activity</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">When</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((item) => (
                  <tr key={item.id} className="border-b border-stitch-border/70 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stitch-ink">{item.displayName}</p>
                      <p className="text-xs text-stitch-muted">{item.email}</p>
                    </td>
                    <td className="px-4 py-3">{item.label}</td>
                    <td className="px-4 py-3 text-stitch-muted">
                      {Object.keys(item.payload).length > 0
                        ? JSON.stringify(item.payload)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-stitch-muted">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}
