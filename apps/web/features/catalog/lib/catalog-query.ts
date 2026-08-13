import {
  DEFAULT_CATALOG_SORT,
  EMPTY_CATALOG_FILTERS,
  hasActiveCatalogFilters,
  isCatalogSort,
  type CatalogFilters,
  type CatalogSort,
} from "./catalog-products";

export const PRODUCTS_PER_PAGE = 24;
export const MAX_SEARCH_LENGTH = 100;

export type CatalogFilterSearchParams = {
  minPrice?: string | string[];
  maxPrice?: string | string[];
  sale?: string | string[];
  stock?: string | string[];
  featured?: string | string[];
};

export function parseBusinessId(value: string) {
  const businessId = Number(value);
  return Number.isInteger(businessId) && businessId > 0 ? businessId : null;
}

export function parsePageNumber(value: string | string[] | undefined) {
  if (value === undefined) return 1;
  if (Array.isArray(value) || !/^[1-9]\d*$/.test(value)) return null;

  const page = Number(value);
  return Number.isSafeInteger(page) ? page : null;
}

export function parseCatalogSort(value: string | string[] | undefined): CatalogSort | null {
  if (value === undefined) return DEFAULT_CATALOG_SORT;
  if (Array.isArray(value) || !isCatalogSort(value)) return null;
  return value;
}

export function parseSearchQuery(value: string | string[] | undefined) {
  if (value === undefined) return "";
  if (Array.isArray(value)) return null;

  const query = value.trim();
  return query.length <= MAX_SEARCH_LENGTH ? query : null;
}

function parseOptionalPrice(value: string | string[] | undefined) {
  if (value === undefined) return { valid: true as const, value: null };
  if (Array.isArray(value) || !/^\d+(?:\.\d{1,2})?$/.test(value)) {
    return { valid: false as const };
  }

  const price = Number(value);
  return Number.isFinite(price) && price >= 0
    ? { valid: true as const, value: price }
    : { valid: false as const };
}

function parseFlag(value: string | string[] | undefined) {
  if (value === undefined) return { valid: true as const, value: false };
  return value === "1"
    ? { valid: true as const, value: true }
    : { valid: false as const };
}

export function parseCatalogFilters(params: CatalogFilterSearchParams): CatalogFilters | null {
  const minPrice = parseOptionalPrice(params.minPrice);
  const maxPrice = parseOptionalPrice(params.maxPrice);
  const onSale = parseFlag(params.sale);
  const inStock = parseFlag(params.stock);
  const featured = parseFlag(params.featured);

  if (
    !minPrice.valid ||
    !maxPrice.valid ||
    !onSale.valid ||
    !inStock.valid ||
    !featured.valid
  ) {
    return null;
  }

  if (minPrice.value !== null && maxPrice.value !== null && minPrice.value > maxPrice.value) {
    return null;
  }

  return {
    minPrice: minPrice.value,
    maxPrice: maxPrice.value,
    onSale: onSale.value,
    inStock: inStock.value,
    featured: featured.value,
  };
}

export function getSortOrder(sort: CatalogSort) {
  if (sort === "price-asc") return { column: "price", ascending: true } as const;
  if (sort === "price-desc") return { column: "price", ascending: false } as const;
  if (sort === "created-asc") return { column: "creation_date", ascending: true } as const;
  return { column: "creation_date", ascending: false } as const;
}

export function getPostgrestSearchPattern(query: string) {
  const escapedLikePattern = query.replace(/[\\%_]/g, "\\$&");
  const escapedPostgrestValue = escapedLikePattern
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
  return `"%${escapedPostgrestValue}%"`;
}

export function isAlternativeCatalogView(
  sort: CatalogSort,
  searchQuery: string,
  filters: CatalogFilters = EMPTY_CATALOG_FILTERS,
) {
  return (
    sort !== DEFAULT_CATALOG_SORT ||
    Boolean(searchQuery) ||
    hasActiveCatalogFilters(filters)
  );
}
