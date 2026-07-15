import { NextRequest } from "next/server";
import { jsonError, jsonSuccess } from "@/lib/api-utils";
import { requireSessionUser } from "@/lib/admin-auth";
import { logUserActivity } from "@/lib/user-activity";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const user = await requireSessionUser();
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("Image file is required", 400);
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return jsonError("Use a JPG, PNG, or WebP image", 400);
    }

    if (file.size > MAX_BYTES) {
      return jsonError("Image must be 5 MB or smaller", 400);
    }

    const supabase = await createClient();
    if (!supabase) {
      return jsonError("Supabase not configured", 503);
    }

    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const storagePath = `${user.id}/avatar.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("stitch-profile-images")
      .upload(storagePath, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      return jsonError(uploadError.message, 400);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("stitch-profile-images").getPublicUrl(storagePath);

    const avatarUrl = `${publicUrl}?v=${Date.now()}`;

    await supabase
      .from("profiles")
      .update({ avatar_url: avatarUrl } as never)
      .eq("id", user.id);

    await logUserActivity({
      userId: user.id,
      activityType: "avatar_uploaded",
      payload: { avatarUrl },
    });

    return jsonSuccess({ avatarUrl });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to upload profile photo";
    const status = message.includes("required") ? 401 : 500;
    return jsonError(message, status);
  }
}
