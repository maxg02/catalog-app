import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeProduct } from "@/test/fixtures";
import { ProductCard } from "./product-card";

describe("ProductCard", () => {
  it("renders a grid product with its image, price, and stock state", () => {
    render(<ProductCard product={makeProduct()} mode="grid" />);

    expect(screen.getByRole("img", { name: "Demo product" })).toHaveAttribute(
      "src",
      "https://images.example/product.jpg",
    );
    expect(screen.getByText("$25.00")).toBeVisible();
    expect(screen.getByText("In Stock")).toBeVisible();
    expect(screen.queryByText("A product description")).not.toBeInTheDocument();
  });

  it("renders sale pricing, an unavailable state, and a fallback image", () => {
    render(
      <ProductCard
        product={makeProduct({
          name: "Sold product",
          image: [],
          sale: true,
          salePrice: 15,
          onStock: false,
        })}
        mode="grid"
      />,
    );

    expect(screen.getByRole("img", { name: "No image available for Sold product" })).toHaveTextContent(
      "S",
    );
    expect(screen.getByText("Sale")).toBeVisible();
    expect(screen.getByText("$15.00")).toBeVisible();
    expect(screen.getByText("$25.00").tagName).toBe("DEL");
    expect(screen.getByText("Out of stock")).toBeVisible();
  });

  it("shows the description in list mode", () => {
    render(<ProductCard product={makeProduct()} mode="list" />);
    expect(screen.getByText("A product description")).toBeVisible();
  });
});
