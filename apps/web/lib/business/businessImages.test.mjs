import { describe, expect, it } from "vitest";
import { getBusinessImageUrls } from "./businessImages.ts";

describe("getBusinessImageUrls", () => {
  it("normalizes a single image, an image array, and empty input", () => {
    expect(getBusinessImageUrls({ image_url: "banner" })).toEqual(["banner"]);
    expect(getBusinessImageUrls([{ image_url: "banner" }])).toEqual(["banner"]);
    expect(getBusinessImageUrls(null)).toEqual([]);
  });
});
