import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeProduct } from "@/test/fixtures";

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>();
  return { ...react, useTransition: () => [true, vi.fn()] as const };
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import { CatalogBrowser } from "./catalog-browser";

describe("CatalogBrowser loading state", () => {
  it("shows four skeleton cards and hides pagination while navigation is pending", () => {
    render(
      <CatalogBrowser
        products={[makeProduct()]}
        featuredProducts={[]}
        businessName="Demo Store"
        businessId={1}
        currentPage={1}
        totalPages={2}
        sort="created-desc"
        searchQuery=""
      />,
    );

    const loading = screen.getByRole("status", { name: "Loading products" });
    expect(loading.children).toHaveLength(4);
    expect(screen.queryByRole("navigation", { name: "Product catalog pages" })).not.toBeInTheDocument();
  });
});
