import { describe, expect, it } from "vitest";
import {
  getPostgrestSearchPattern,
  getSortOrder,
  isAlternativeCatalogView,
  MAX_SEARCH_LENGTH,
  parseBusinessId,
  parseCatalogFilters,
  parseCatalogSort,
  parsePageNumber,
  parseSearchQuery,
  PRODUCTS_PER_PAGE,
} from "./catalog-query";

describe("catalog query parsing", () => {
  it("accepts only positive integer business ids", () => {
    expect(parseBusinessId("12")).toBe(12);
    expect(parseBusinessId("0")).toBeNull();
    expect(parseBusinessId("1.5")).toBeNull();
    expect(parseBusinessId("business")).toBeNull();
  });

  it("defaults page one and rejects malformed or unsafe pages", () => {
    expect(PRODUCTS_PER_PAGE).toBe(24);
    expect(parsePageNumber(undefined)).toBe(1);
    expect(parsePageNumber("2")).toBe(2);
    expect(parsePageNumber("0")).toBeNull();
    expect(parsePageNumber("02")).toBeNull();
    expect(parsePageNumber(["1", "2"])).toBeNull();
    expect(parsePageNumber(String(Number.MAX_SAFE_INTEGER + 1))).toBeNull();
  });

  it("defaults newest sorting and rejects unknown or repeated sorts", () => {
    expect(parseCatalogSort(undefined)).toBe("created-desc");
    expect(parseCatalogSort("price-asc")).toBe("price-asc");
    expect(parseCatalogSort("unknown")).toBeNull();
    expect(parseCatalogSort(["price-asc"])).toBeNull();
  });

  it("trims searches, permits an empty search, and enforces its limit", () => {
    expect(parseSearchQuery(undefined)).toBe("");
    expect(parseSearchQuery("  Demo 04  ")).toBe("Demo 04");
    expect(parseSearchQuery("   ")).toBe("");
    expect(parseSearchQuery(["one", "two"])).toBeNull();
    expect(parseSearchQuery("x".repeat(MAX_SEARCH_LENGTH + 1))).toBeNull();
  });

  it("parses price and boolean filters", () => {
    expect(parseCatalogFilters({})).toEqual({
      minPrice: null,
      maxPrice: null,
      onSale: false,
      inStock: false,
      featured: false,
    });
    expect(
      parseCatalogFilters({
        minPrice: "10.5",
        maxPrice: "100",
        sale: "1",
        stock: "1",
        featured: "1",
      }),
    ).toEqual({
      minPrice: 10.5,
      maxPrice: 100,
      onSale: true,
      inStock: true,
      featured: true,
    });
  });

  it("rejects malformed, negative, repeated, and inverted filters", () => {
    expect(parseCatalogFilters({ minPrice: "-1" })).toBeNull();
    expect(parseCatalogFilters({ minPrice: "0x10" })).toBeNull();
    expect(parseCatalogFilters({ minPrice: "1.234" })).toBeNull();
    expect(parseCatalogFilters({ maxPrice: "not-a-price" })).toBeNull();
    expect(parseCatalogFilters({ minPrice: ["1", "2"] })).toBeNull();
    expect(parseCatalogFilters({ sale: "true" })).toBeNull();
    expect(parseCatalogFilters({ stock: ["1"] })).toBeNull();
    expect(parseCatalogFilters({ minPrice: "100", maxPrice: "10" })).toBeNull();
  });
});

describe("catalog database and SEO configuration", () => {
  it.each([
    ["created-desc", { column: "creation_date", ascending: false }],
    ["created-asc", { column: "creation_date", ascending: true }],
    ["price-asc", { column: "price", ascending: true }],
    ["price-desc", { column: "price", ascending: false }],
  ] as const)("maps %s to its database order", (sort, expected) => {
    expect(getSortOrder(sort)).toEqual(expected);
  });

  it("quotes reserved PostgREST characters and escapes LIKE wildcards", () => {
    expect(getPostgrestSearchPattern("Demo 04")).toBe('"%Demo 04%"');
    expect(getPostgrestSearchPattern("50%_off")).toBe('"%50\\\\%\\\\_off%"');
    expect(getPostgrestSearchPattern('a,b"c')).toBe('"%a,b\\"c%"');
  });

  it("marks searches and alternative sorts as non-indexable views", () => {
    expect(isAlternativeCatalogView("created-desc", "")).toBe(false);
    expect(isAlternativeCatalogView("created-desc", "demo")).toBe(true);
    expect(isAlternativeCatalogView("price-asc", "")).toBe(true);
    expect(
      isAlternativeCatalogView("created-desc", "", {
        minPrice: null,
        maxPrice: null,
        onSale: false,
        inStock: true,
        featured: false,
      }),
    ).toBe(true);
  });
});
