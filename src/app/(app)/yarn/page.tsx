import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { getServerAppUser } from "@/lib/app-user";
import { YarnVaultClient } from "@/components/stitch/yarn/YarnVaultClient";
import { mapRowToVaultYarn } from "@/services/yarnService";
import type { YarnInventory } from "@/types/database";

export default async function YarnVaultPage() {
  let initialYarns: ReturnType<typeof mapRowToVaultYarn>[] = [];
  let initialError: string | null = null;

  if (!isSupabaseConfigured()) {
    initialError = "Sign in to save yarn to your account.";
  } else {
    const appUser = await getServerAppUser();
    if (!appUser) {
      initialError = "Sign in to view and save your yarn stash.";
    } else {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from("yarn_inventory")
          .select("*")
          .eq("user_id", appUser.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("[yarn/page] load inventory", error);
          initialError = "Could not load your yarn stash.";
        } else {
          initialYarns = ((data ?? []) as YarnInventory[]).map(mapRowToVaultYarn);
        }
      }
    }
  }

  return (
    <YarnVaultClient initialYarns={initialYarns} initialError={initialError} />
  );
}
