import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProduct } from "@/test/fixtures";
import { CatalogBrowser } from "./catalog-browser";

const navigation = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: navigation.push }),
}));

const defaultProps = {
  products: [
    makeProduct({ id: 1, name: "Available product", description: "Available description" }),
    makeProduct({ id: 2, name: "Unavailable product", onStock: false }),
  ],
  featuredProducts: [],
  businessName: "Demo Store",
  businessId: 7,
  currentPage: 1,
  totalPages: 1,
  sort: "created-desc" as const,
  searchQuery: "",
};

beforeEach(() => navigation.push.mockReset());

describe("CatalogBrowser", () => {
  it("submits search once from the icon button instead of navigating per character", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} />);

    const input = screen.getByRole("searchbox", { name: "Search products" });
    await user.type(input, " Demo 04 ");
    expect(navigation.push).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Search products" }));
    expect(navigation.push).toHaveBeenCalledOnce();
    expect(navigation.push).toHaveBeenCalledWith("/catalog/7?q=Demo+04");
  });

  it("clears an active search and navigates to the clean catalog URL", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} searchQuery="demo" />);

    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByRole("searchbox", { name: "Search products" })).toHaveValue("");
    expect(navigation.push).toHaveBeenCalledWith("/catalog/7");
  });

  it("filters stock locally and toggles between grid and list content", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} />);

    expect(screen.getByText("2 products shown")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show in-stock products only" }));
    expect(screen.getByText("1 product shown")).toBeInTheDocument();
    expect(screen.queryByText("Unavailable product")).not.toBeInTheDocument();

    expect(screen.queryByText("Available description")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Switch to list view" }));
    expect(screen.getByText("Available description")).toBeVisible();
    expect(screen.getByRole("button", { name: "Switch to grid view" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("changes the server sort through the shadcn dropdown and preserves the search", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} searchQuery="demo" />);

    await user.click(screen.getByRole("button", { name: "Sort products. Current order: Newest" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Price: Low to high" }));

    expect(navigation.push).toHaveBeenCalledWith("/catalog/7?sort=price-asc&q=demo");
  });

  it("shows contextual empty states", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<CatalogBrowser {...defaultProps} products={[]} />);
    expect(screen.getByText("Demo Store has not published any products yet.")).toBeVisible();

    rerender(<CatalogBrowser {...defaultProps} products={[makeProduct({ onStock: false })]} />);
    await user.click(screen.getByRole("button", { name: "Show in-stock products only" }));
    expect(screen.getByText("Try another search or turn off the stock filter.")).toBeVisible();
  });
});
