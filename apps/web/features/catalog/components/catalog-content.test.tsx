import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EMPTY_CATALOG_FILTERS } from "../lib/catalog-products";
import { BusinessSummary } from "./business-summary";
import { CatalogHeader } from "./catalog-header";

const navigation = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
}));

beforeEach(() => {
  navigation.push.mockReset();
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});

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

  it("applies filters from the header while preserving search and sort state", async () => {
    const user = userEvent.setup();
    render(
      <CatalogHeader
        businessName="Demo Store"
        businessId={7}
        image={null}
        searchQuery="demo"
        sort="price-asc"
        filters={EMPTY_CATALOG_FILTERS}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filter products" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Products in stock" }));
    await user.click(screen.getByRole("button", { name: "Apply filters" }));

    expect(navigation.push).toHaveBeenCalledWith(
      "/catalog/7?sort=price-asc&q=demo&stock=1",
    );
  });

  it("activates the elevated header treatment after scrolling", () => {
    render(
      <CatalogHeader
        businessName="Demo Store"
        businessId={7}
        image={null}
        searchQuery=""
        sort="created-desc"
        filters={EMPTY_CATALOG_FILTERS}
      />,
    );

    const header = screen.getByRole("banner");
    expect(header).toHaveAttribute("data-scrolled", "false");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 40 });
    fireEvent.scroll(window);
    expect(header).toHaveAttribute("data-scrolled", "true");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    fireEvent.scroll(window);
    expect(header).toHaveAttribute("data-scrolled", "false");
  });
});
