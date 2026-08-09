import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CatalogPagination } from "./catalog-pagination";

describe("CatalogPagination", () => {
  it("renders crawlable first, previous, numbered, next, and last links", () => {
    render(
      <CatalogPagination
        businessId={7}
        currentPage={3}
        totalPages={8}
        sort="price-asc"
        searchQuery="Demo 04"
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Product catalog pages" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Go to first page" })).toHaveAttribute(
      "href",
      "/catalog/7?sort=price-asc&q=Demo+04",
    );
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "href",
      "/catalog/7?page=2&sort=price-asc&q=Demo+04",
    );
    expect(screen.getByRole("link", { name: "Go to page 3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Go to next page" })).toHaveAttribute(
      "href",
      "/catalog/7?page=4&sort=price-asc&q=Demo+04",
    );
    expect(screen.getByRole("link", { name: "Go to last page" })).toHaveAttribute(
      "href",
      "/catalog/7?page=8&sort=price-asc&q=Demo+04",
    );
    expect(screen.getByText("Page 3 of 8")).toBeInTheDocument();
  });

  it("uses client navigation for an ordinary click", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <CatalogPagination
        businessId={1}
        currentPage={2}
        totalPages={3}
        sort="created-desc"
        searchQuery=""
        onNavigate={onNavigate}
      />,
    );

    await user.click(screen.getByRole("link", { name: "Go to next page" }));
    expect(onNavigate).toHaveBeenCalledWith("/catalog/1?page=3");
  });

  it("disables boundary controls and omits pagination for a single page", () => {
    const { rerender } = render(
      <CatalogPagination
        businessId={1}
        currentPage={1}
        totalPages={2}
        sort="created-desc"
        searchQuery=""
        onNavigate={vi.fn()}
      />,
    );

    expect(screen.getByRole("link", { name: "Go to first page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("link", { name: "Go to previous page" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    rerender(
      <CatalogPagination
        businessId={1}
        currentPage={1}
        totalPages={1}
        sort="created-desc"
        searchQuery=""
        onNavigate={vi.fn()}
      />,
    );
    expect(screen.queryByRole("navigation", { name: "Product catalog pages" })).not.toBeInTheDocument();
  });
});
