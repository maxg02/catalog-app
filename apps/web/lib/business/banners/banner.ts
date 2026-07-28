import type { SupabaseClient } from "@supabase/supabase-js";
import {
    deleteImageUrlsFromR2,
    deleteUploadedImages,
    uploadImagesToR2,
    type UploadedImage,
} from "@/lib/products/productRequest";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type BannerAction = "keep" | "replace" | "remove";
type BannerInput = { action: BannerAction; image: File | null };

type BannerBody = { bannerAction?: unknown; bannerImage?: unknown };

function validateBanner(body: BannerBody, defaultAction: BannerAction) {
    const action = body.bannerAction ?? defaultAction;
    const image = body.bannerImage instanceof File ? body.bannerImage : null;

    if (action !== "keep" && action !== "replace" && action !== "remove") {
        return { ok: false as const, fieldErrors: { bannerImage: "Banner action is invalid." } };
    }
    if (action === "replace" && !image) {
        return { ok: false as const, fieldErrors: { bannerImage: "A banner image is required." } };
    }
    if (image && !IMAGE_TYPES.has(image.type)) {
        return { ok: false as const, fieldErrors: { bannerImage: "Banner must be JPEG, PNG, WebP, or GIF." } };
    }
    if (image && image.size > MAX_IMAGE_SIZE) {
        return { ok: false as const, fieldErrors: { bannerImage: "Banner must be 5MB or smaller." } };
    }

    return { ok: true as const, banner: { action, image } satisfies BannerInput };
}

async function syncBusinessBanner(supabase: SupabaseClient, businessId: number, banner: BannerInput) {
    if (banner.action === "keep") return;

    const { data: existing, error: existingError } = await supabase
        .from("business_images")
        .select("image_url")
        .eq("business_id", businessId);
    if (existingError) throw existingError;

    const existingUrls = (existing ?? []).map((row) => row.image_url as string);
    if (banner.action === "remove") {
        const { error } = await supabase.from("business_images").delete().eq("business_id", businessId);
        if (error) throw error;
        await deleteImageUrlsFromR2(existingUrls);
        return;
    }

    let uploaded: UploadedImage[] = [];
    try {
        uploaded = await uploadImagesToR2(businessId, [banner.image!], "business/banners");
        const { error } = await supabase.from("business_images").upsert(
            { business_id: businessId, image_url: uploaded[0].url },
            { onConflict: "business_id" },
        );
        if (error) throw error;
    } catch (error) {
        await deleteUploadedImages(uploaded);
        throw error;
    }

    await deleteImageUrlsFromR2(existingUrls);
}

export { syncBusinessBanner, validateBanner };
export type { BannerAction, BannerInput };
