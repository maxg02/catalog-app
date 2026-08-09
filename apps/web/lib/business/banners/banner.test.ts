import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSupabaseMock, createSupabaseQuery } from "@/test/supabase-mock";
import { syncBusinessBanner, validateBanner } from "./banner";

const storage = vi.hoisted(() => ({
  uploadImagesToR2: vi.fn(),
  deleteUploadedImages: vi.fn(async () => undefined),
  deleteImageUrlsFromR2: vi.fn(async () => undefined),
}));

vi.mock("@/lib/products/productRequest", () => storage);

beforeEach(() => {
  vi.clearAllMocks();
  storage.uploadImagesToR2.mockResolvedValue([
    { key: "business/banners/1/banner.jpg", url: "https://images.example/new.jpg" },
  ]);
});

describe("validateBanner", () => {
  it("uses the requested/default action and accepts supported images", () => {
    expect(validateBanner({}, "keep")).toEqual({
      ok: true,
      banner: { action: "keep", image: null },
    });
    const image = new File(["image"], "banner.webp", { type: "image/webp" });
    expect(validateBanner({ bannerAction: "replace", bannerImage: image }, "keep")).toEqual({
      ok: true,
      banner: { action: "replace", image },
    });
  });

  it("rejects invalid actions, missing replacements, file types, and oversized files", () => {
    expect(validateBanner({ bannerAction: "invalid" }, "keep")).toMatchObject({ ok: false });
    expect(validateBanner({ bannerAction: "replace" }, "keep")).toMatchObject({ ok: false });
    expect(
      validateBanner(
        { bannerAction: "replace", bannerImage: new File(["x"], "banner.txt", { type: "text/plain" }) },
        "keep",
      ),
    ).toMatchObject({ ok: false });
    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "banner.jpg", {
      type: "image/jpeg",
    });
    expect(validateBanner({ bannerAction: "replace", bannerImage: oversized }, "keep")).toMatchObject({
      ok: false,
    });
  });
});

describe("syncBusinessBanner", () => {
  it("leaves storage and the database unchanged for keep", async () => {
    const supabase = createSupabaseMock({});
    await syncBusinessBanner(supabase as never, 1, { action: "keep", image: null });
    expect(supabase.from).not.toHaveBeenCalled();
    expect(storage.uploadImagesToR2).not.toHaveBeenCalled();
  });

  it("removes the database row before deleting the old object", async () => {
    const deleteQuery = createSupabaseQuery({ error: null });
    const supabase = createSupabaseMock({
      business_images: [
        createSupabaseQuery({ data: [{ image_url: "https://images.example/old.jpg" }], error: null }),
        deleteQuery,
      ],
    });

    await syncBusinessBanner(supabase as never, 1, { action: "remove", image: null });
    expect(deleteQuery.delete).toHaveBeenCalledOnce();
    expect(storage.deleteImageUrlsFromR2).toHaveBeenCalledWith([
      "https://images.example/old.jpg",
    ]);
  });

  it("uploads and upserts a replacement before deleting the old object", async () => {
    const image = new File(["image"], "banner.jpg", { type: "image/jpeg" });
    const upsertQuery = createSupabaseQuery({ error: null });
    const supabase = createSupabaseMock({
      business_images: [
        createSupabaseQuery({ data: [{ image_url: "https://images.example/old.jpg" }], error: null }),
        upsertQuery,
      ],
    });

    await syncBusinessBanner(supabase as never, 1, { action: "replace", image });
    expect(storage.uploadImagesToR2).toHaveBeenCalledWith(1, [image], "business/banners");
    expect(upsertQuery.upsert).toHaveBeenCalledWith(
      { business_id: 1, image_url: "https://images.example/new.jpg" },
      { onConflict: "business_id" },
    );
    expect(storage.deleteImageUrlsFromR2).toHaveBeenCalledWith([
      "https://images.example/old.jpg",
    ]);
  });

  it("cleans up a newly uploaded object if the upsert fails", async () => {
    const uploaded = { key: "business/banners/1/banner.jpg", url: "https://images.example/new.jpg" };
    storage.uploadImagesToR2.mockResolvedValue([uploaded]);
    const supabase = createSupabaseMock({
      business_images: [
        createSupabaseQuery({ data: [], error: null }),
        createSupabaseQuery({ error: { message: "upsert failed" } }),
      ],
    });

    await expect(
      syncBusinessBanner(supabase as never, 1, {
        action: "replace",
        image: new File(["image"], "banner.jpg", { type: "image/jpeg" }),
      }),
    ).rejects.toEqual({ message: "upsert failed" });
    expect(storage.deleteUploadedImages).toHaveBeenCalledWith([uploaded]);
  });
});
