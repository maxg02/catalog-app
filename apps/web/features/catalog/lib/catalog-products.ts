import type { ProductDto } from "@internal/interfaces";

export type CatalogSort = "created-desc" | "created-asc" | "price-asc" | "price-desc";

export const DEFAULT_CATALOG_SORT: CatalogSort = "created-desc";

export const catalogSortOptions: {
  value: CatalogSort;
  label: string;
  shortLabel: string;
}[] = [
  {
    value: DEFAULT_CATALOG_SORT,
    label: "Creation date: Newest",
    shortLabel: "Newest",
  },
  { value: "created-asc", label: "Creation date: Oldest", shortLabel: "Oldest" },
  { value: "price-asc", label: "Price: Low to high", shortLabel: "Price ↑" },
  { value: "price-desc", label: "Price: High to low", shortLabel: "Price ↓" },
];

export function isCatalogSort(value: string): value is CatalogSort {
  return catalogSortOptions.some((option) => option.value === value);
}

export function getCatalogHref(
  businessId: number,
  page: number,
  sort: CatalogSort,
  searchQuery = "",
) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (sort !== DEFAULT_CATALOG_SORT) params.set("sort", sort);
  if (searchQuery) params.set("q", searchQuery);

  const query = params.toString();
  return `/catalog/${businessId}${query ? `?${query}` : ""}`;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function getProductPrice(product: ProductDto) {
  return product.sale && product.salePrice !== null ? product.salePrice : product.price;
}

export function formatProductPrice(price: number) {
  return currencyFormatter.format(price);
}
