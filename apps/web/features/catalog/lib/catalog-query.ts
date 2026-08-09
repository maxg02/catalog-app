import {
  DEFAULT_CATALOG_SORT,
  isCatalogSort,
  type CatalogSort,
} from "./catalog-products";

export const PRODUCTS_PER_PAGE = 24;
export const MAX_SEARCH_LENGTH = 100;

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

export function isAlternativeCatalogView(sort: CatalogSort, searchQuery: string) {
  return sort !== DEFAULT_CATALOG_SORT || Boolean(searchQuery);
}
