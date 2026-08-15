import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProduct } from "@/test/fixtures";
import { EMPTY_CATALOG_FILTERS } from "../lib/catalog-products";
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
  filters: EMPTY_CATALOG_FILTERS,
};

beforeEach(() => navigation.push.mockReset());

describe("CatalogBrowser", () => {
  it("submits search once from the icon button instead of navigating per character", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} />);

    const input = screen.getByRole("searchbox", { name: "Search products" });
    expect(input).toHaveClass("[&::-webkit-search-cancel-button]:hidden");
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

  it("keeps products in a grid and exposes the desktop filter sidebar", () => {
    render(<CatalogBrowser {...defaultProps} />);

    expect(screen.queryByText("Available description")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Switch to .* view/ })).not.toBeInTheDocument();
    expect(screen.getByRole("complementary", { name: "Catalog filters" })).toBeInTheDocument();
  });

  it("applies price, sale, stock, and featured filters through the shadcn menu", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Filter products" }));
    const menu = screen.getByRole("menu");
    await user.type(within(menu).getByRole("spinbutton", { name: "Minimum price" }), "10");
    await user.type(within(menu).getByRole("spinbutton", { name: "Maximum price" }), "100");
    await user.click(within(menu).getByRole("menuitemcheckbox", { name: "Products on sale" }));
    await user.click(within(menu).getByRole("menuitemcheckbox", { name: "Products in stock" }));
    await user.click(within(menu).getByRole("menuitemcheckbox", { name: "Featured products" }));
    await user.click(within(menu).getByRole("button", { name: "Apply filters" }));

    expect(navigation.push).toHaveBeenCalledWith(
      "/catalog/7?minPrice=10&maxPrice=100&sale=1&stock=1&featured=1",
    );
  });

  it("applies the existing filters from the desktop sidebar", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} />);
    const sidebar = screen.getByRole("complementary", { name: "Catalog filters" });

    await user.type(within(sidebar).getByRole("spinbutton", { name: "Min price" }), "25");
    await user.click(within(sidebar).getByRole("checkbox", { name: "Products in stock" }));
    await user.click(within(sidebar).getByRole("button", { name: "Apply filters" }));

    expect(navigation.push).toHaveBeenCalledWith("/catalog/7?minPrice=25&stock=1");
  });

  it("clears committed filters while preserving search and sort state", async () => {
    const user = userEvent.setup();
    render(
      <CatalogBrowser
        {...defaultProps}
        searchQuery="demo"
        sort="price-asc"
        filters={{ ...EMPTY_CATALOG_FILTERS, onSale: true, featured: true }}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Filter products. 2 active filters" }),
    );
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(navigation.push).toHaveBeenCalledWith("/catalog/7?sort=price-asc&q=demo");
  });

  it("blocks an inverted price range", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: "Filter products" }));
    const menu = screen.getByRole("menu");
    await user.type(within(menu).getByRole("spinbutton", { name: "Minimum price" }), "100");
    await user.type(within(menu).getByRole("spinbutton", { name: "Maximum price" }), "10");

    expect(within(menu).getByRole("alert")).toHaveTextContent("Enter a valid price range.");
    expect(within(menu).getByRole("button", { name: "Apply filters" })).toBeDisabled();
  });

  it("changes the server sort through the shadcn dropdown and preserves the search", async () => {
    const user = userEvent.setup();
    render(<CatalogBrowser {...defaultProps} searchQuery="demo" />);

    await user.click(screen.getByRole("button", { name: "Sort products. Current order: Newest" }));
    await user.click(screen.getByRole("menuitemradio", { name: "Price: Low to high" }));

    expect(navigation.push).toHaveBeenCalledWith("/catalog/7?sort=price-asc&q=demo");
  });

  it("shows contextual empty states", () => {
    const { rerender } = render(<CatalogBrowser {...defaultProps} products={[]} />);
    expect(screen.getByText("Demo Store has not published any products yet.")).toBeVisible();

    rerender(
      <CatalogBrowser
        {...defaultProps}
        products={[]}
        filters={{ ...EMPTY_CATALOG_FILTERS, inStock: true }}
      />,
    );
    expect(screen.getByText("Try adjusting or clearing your filters.")).toBeVisible();
  });
});
