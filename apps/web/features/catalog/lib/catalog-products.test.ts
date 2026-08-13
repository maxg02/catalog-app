import { describe, expect, it } from "vitest";
import { makeProduct } from "@/test/fixtures";
import {
  catalogSortOptions,
  DEFAULT_CATALOG_SORT,
  EMPTY_CATALOG_FILTERS,
  formatProductPrice,
  getCatalogHref,
  getProductPrice,
  hasActiveCatalogFilters,
  isCatalogSort,
} from "./catalog-products";

describe("catalog product helpers", () => {
  it("recognizes every configured sort and rejects unknown values", () => {
    expect(DEFAULT_CATALOG_SORT).toBe("created-desc");
    for (const option of catalogSortOptions) expect(isCatalogSort(option.value)).toBe(true);
    expect(isCatalogSort("popular")).toBe(false);
  });

  it("builds clean default URLs and preserves non-default state", () => {
    expect(getCatalogHref(7, 1, "created-desc")).toBe("/catalog/7");
    expect(getCatalogHref(7, 2, "created-desc")).toBe("/catalog/7?page=2");
    expect(getCatalogHref(7, 1, "price-asc")).toBe("/catalog/7?sort=price-asc");
    expect(getCatalogHref(7, 2, "price-desc", "Demo 04")).toBe(
      "/catalog/7?page=2&sort=price-desc&q=Demo+04",
    );
    expect(
      getCatalogHref(7, 2, "price-desc", "Demo 04", {
        minPrice: 10,
        maxPrice: 100,
        onSale: true,
        inStock: true,
        featured: true,
      }),
    ).toBe(
      "/catalog/7?page=2&sort=price-desc&q=Demo+04&minPrice=10&maxPrice=100&sale=1&stock=1&featured=1",
    );
  });

  it("detects whether a catalog has committed filters", () => {
    expect(hasActiveCatalogFilters(EMPTY_CATALOG_FILTERS)).toBe(false);
    expect(hasActiveCatalogFilters({ ...EMPTY_CATALOG_FILTERS, minPrice: 0 })).toBe(true);
    expect(hasActiveCatalogFilters({ ...EMPTY_CATALOG_FILTERS, onSale: true })).toBe(true);
  });

  it("uses an active sale price and formats USD prices", () => {
    expect(getProductPrice(makeProduct())).toBe(25);
    expect(getProductPrice(makeProduct({ sale: true, salePrice: 15 }))).toBe(15);
    expect(formatProductPrice(15)).toBe("$15.00");
  });
});
