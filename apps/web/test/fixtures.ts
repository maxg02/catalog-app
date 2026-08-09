import type { ProductDto } from "@internal/interfaces";
import type { ProductRow } from "@/interfaces";

export function makeProduct(overrides: Partial<ProductDto> = {}): ProductDto {
  return {
    id: 1,
    name: "Demo product",
    isPublic: true,
    price: 25,
    image: ["https://images.example/product.jpg"],
    description: "A product description",
    isFeatured: false,
    bestSeller: false,
    sale: false,
    salePrice: null,
    saleEndDate: null,
    onStock: true,
    creationDate: new Date("2026-01-02T00:00:00.000Z"),
    details: {},
    businessId: 1,
    ...overrides,
  };
}

export function makeProductRow(overrides: Partial<ProductRow> = {}): ProductRow {
  return {
    id: 1,
    name: "Demo product",
    is_public: true,
    price: 25,
    description: "A product description",
    sale: false,
    sale_price: null,
    sale_end_date: null,
    creation_date: "2026-01-02T00:00:00.000Z",
    business_id: 1,
    details: null,
    on_stock: true,
    is_featured: false,
    product_images: [],
    ...overrides,
  };
}
