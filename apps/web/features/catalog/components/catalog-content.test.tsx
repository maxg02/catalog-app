import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EMPTY_CATALOG_FILTERS } from "../lib/catalog-products";
import { BusinessSummary } from "./business-summary";
import { CatalogHeader } from "./catalog-header";

describe("catalog business content", () => {
  it("renders branded header imagery and a share-by-email link", () => {
    render(
      <CatalogHeader
        businessName="Demo Store"
        businessId={7}
        image="logo.jpg"
        searchQuery="demo"
        sort="price-asc"
        filters={{ ...EMPTY_CATALOG_FILTERS, inStock: true }}
      />,
    );

    expect(screen.getByRole("img", { name: "Demo Store logo" })).toHaveAttribute("src", "logo.jpg");
    expect(screen.getByRole("link", { name: "Share Demo Store catalog by email" })).toHaveAttribute(
      "href",
      "mailto:?subject=Demo%20Store%20catalog",
    );
    expect(screen.getByRole("searchbox", { name: "Search catalog" })).toHaveValue("demo");
    const searchForm = screen.getByRole("searchbox", { name: "Search catalog" }).closest("form");
    expect(searchForm).toHaveAttribute("action", "/catalog/7");
    expect(searchForm?.querySelector('input[name="sort"]')).toHaveValue("price-asc");
    expect(searchForm?.querySelector('input[name="stock"]')).toHaveValue("1");
  });

  it("uses coherent fallbacks when business imagery and description are missing", () => {
    render(
      <BusinessSummary
        name="Demo Store"
        description={null}
        image={null}
        location="Location not provided"
      />,
    );

    expect(screen.getByRole("region", { name: "Business details" })).toBeVisible();
    expect(screen.getByText("Discover products and services from Demo Store.")).toBeVisible();
    expect(screen.getByText("Location not provided")).toBeVisible();
  });
});
