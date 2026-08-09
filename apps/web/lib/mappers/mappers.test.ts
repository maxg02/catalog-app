import { describe, expect, it } from "vitest";
import type { BusinessProfileRow, UserRow } from "@/interfaces";
import { makeProductRow } from "@/test/fixtures";
import { mapProductRowToCatalogDto, mapProductRowToDto } from "./productMapper";
import { mapBusinessProfileRowToDto, mapUserRowToDto } from "./userBusinessMapper";

describe("product mappers", () => {
  it("maps a full product and prioritizes its main image without mutating rows", () => {
    const images = [
      { id: 1, image_url: "secondary", product_id: 1, is_main: false },
      { id: 2, image_url: "main", product_id: 1, is_main: true },
    ];
    const row = makeProductRow({ details: null, product_images: images });

    const product = mapProductRowToDto(row);

    expect(product).toMatchObject({
      id: 1,
      name: "Demo product",
      image: ["main", "secondary"],
      details: {},
      bestSeller: false,
      businessId: 1,
    });
    expect(product.creationDate).toEqual(new Date("2026-01-02T00:00:00.000Z"));
    expect(images[0].image_url).toBe("secondary");
  });

  it("maps the compact catalog representation and a missing main image", () => {
    expect(mapProductRowToCatalogDto(makeProductRow())).toMatchObject({
      id: 1,
      mainImage: null,
      price: 25,
      onStock: true,
    });
  });
});

describe("user and business mappers", () => {
  it("maps user fields unchanged", () => {
    const row = { id: 3, name: "Ada", email: "ada@example.com", role: 0 } as UserRow;
    expect(mapUserRowToDto(row)).toEqual(row);
  });

  it("normalizes one-based categories and banner representations", () => {
    const row = {
      id: 2,
      name: "Shop",
      description: null,
      category: 1,
      location: null,
      user_id: 3,
      business_images: [{ image_url: "banner" }],
    } satisfies BusinessProfileRow;

    expect(mapBusinessProfileRowToDto(row)).toEqual({
      id: 2,
      name: "Shop",
      bannerImage: "banner",
      description: null,
      category: 0,
      location: null,
      userId: 3,
    });
    expect(mapBusinessProfileRowToDto({ ...row, category: null, business_images: null })).toMatchObject({
      category: null,
      bannerImage: null,
    });
  });
});
