import type { ProductDto } from "@internal/interfaces";

export type CatalogSort = "created-desc" | "created-asc" | "price-asc" | "price-desc";

export type CatalogFilters = {
  minPrice: number | null;
  maxPrice: number | null;
  onSale: boolean;
  inStock: boolean;
  featured: boolean;
};

export const DEFAULT_CATALOG_SORT: CatalogSort = "created-desc";

export const EMPTY_CATALOG_FILTERS: CatalogFilters = {
  minPrice: null,
  maxPrice: null,
  onSale: false,
  inStock: false,
  featured: false,
};

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
  filters: CatalogFilters = EMPTY_CATALOG_FILTERS,
) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (sort !== DEFAULT_CATALOG_SORT) params.set("sort", sort);
  if (searchQuery) params.set("q", searchQuery);
  if (filters.minPrice !== null) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("maxPrice", String(filters.maxPrice));
  if (filters.onSale) params.set("sale", "1");
  if (filters.inStock) params.set("stock", "1");
  if (filters.featured) params.set("featured", "1");

  const query = params.toString();
  return `/catalog/${businessId}${query ? `?${query}` : ""}`;
}

export function hasActiveCatalogFilters(filters: CatalogFilters) {
  return (
    filters.minPrice !== null ||
    filters.maxPrice !== null ||
    filters.onSale ||
    filters.inStock ||
    filters.featured
  );
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
