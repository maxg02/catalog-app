import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeProduct } from "@/test/fixtures";
import { FeaturedProduct } from "./featured-product";

describe("FeaturedProduct", () => {
  it("shows product content without a badge for a regular featured product", () => {
    render(<FeaturedProduct product={makeProduct({ name: "Featured", isFeatured: true })} />);

    expect(screen.getByRole("img", { name: "Featured" })).toBeVisible();
    expect(screen.getByText("$25.00")).toBeVisible();
    expect(screen.queryByText("Best Seller")).not.toBeInTheDocument();
  });

  it("shows the primary badge only for a best seller", () => {
    render(<FeaturedProduct product={makeProduct({ bestSeller: true })} />);
    expect(screen.getByText("Best Seller")).toBeVisible();
  });
});
