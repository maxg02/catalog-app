import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BusinessSummary } from "./business-summary";
import { CatalogHeader } from "./catalog-header";

describe("catalog business content", () => {
  it("renders branded header imagery and a share-by-email link", () => {
    render(<CatalogHeader businessName="Demo Store" image="logo.jpg" />);

    expect(screen.getByRole("img", { name: "Demo Store logo" })).toHaveAttribute("src", "logo.jpg");
    expect(screen.getByRole("link", { name: "Share Demo Store catalog by email" })).toHaveAttribute(
      "href",
      "mailto:?subject=Demo%20Store%20catalog",
    );
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
