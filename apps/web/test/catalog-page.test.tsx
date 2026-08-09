import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProductRow } from "@/test/fixtures";
import { createSupabaseMock, createSupabaseQuery } from "@/test/supabase-mock";
import CatalogPage, { generateMetadata } from "@/app/catalog/[id]/page";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  cookies: vi.fn(async () => ({})),
  headers: vi.fn(async () => new Headers()),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn((href: string) => {
    throw new Error(`NEXT_REDIRECT:${href}`);
  }),
  browser: vi.fn(() => null),
  header: vi.fn(() => null),
  summary: vi.fn(() => null),
}));

vi.mock("@/utils/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/headers", () => ({ cookies: mocks.cookies, headers: mocks.headers }));
vi.mock("next/navigation", () => ({ notFound: mocks.notFound, redirect: mocks.redirect }));
vi.mock("@/features/catalog/components/catalog-browser", () => ({ CatalogBrowser: mocks.browser }));
vi.mock("@/features/catalog/components/catalog-header", () => ({ CatalogHeader: mocks.header }));
vi.mock("@/features/catalog/components/business-summary", () => ({ BusinessSummary: mocks.summary }));

const props = (
  id: string,
  searchParams: { page?: string | string[]; sort?: string | string[]; q?: string | string[] } = {},
) => ({ params: Promise.resolve({ id }), searchParams: Promise.resolve(searchParams) });

const businessRow = {
  id: 7,
  name: "Demo Store",
  description: "Store description",
  category: null,
  location: { address: "", city: "Santo Domingo", country: "Dominican Republic" },
  user_id: 2,
  business_images: [{ image_url: "banner.jpg" }],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.headers.mockResolvedValue(new Headers({ host: "localhost:3000" }));
});

describe("catalog metadata", () => {
  it("provides a self-referencing paginated canonical URL", async () => {
    mocks.headers.mockResolvedValue(
      new Headers({ "x-forwarded-host": "catalog.example", "x-forwarded-proto": "https" }),
    );
    const metadata = await generateMetadata(props("7", { page: "2" }));

    expect(metadata.metadataBase?.toString()).toBe("https://catalog.example/");
    expect(metadata.title).toBe("Product Catalog - Page 2");
    expect(metadata.alternates).toEqual({ canonical: "/catalog/7?page=2" });
    expect(metadata.robots).toBeUndefined();
  });

  it("prevents indexing search and alternative-sort URLs while retaining the canonical page", async () => {
    const metadata = await generateMetadata(
      props("7", { page: "2", sort: "price-desc", q: "demo" }),
    );

    expect(metadata.alternates).toEqual({ canonical: "/catalog/7?page=2" });
    expect(metadata.robots).toEqual({ index: false, follow: true });
  });

  it("rejects malformed catalog parameters", async () => {
    await expect(generateMetadata(props("invalid"))).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(generateMetadata(props("7", { page: "0" }))).rejects.toThrow("NEXT_NOT_FOUND");
    await expect(generateMetadata(props("7", { sort: "popular" }))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});

describe("CatalogPage server query", () => {
  it("searches case-insensitively, sorts and paginates on the backend, then passes mapped data", async () => {
    const productsQuery = createSupabaseQuery({ data: [makeProductRow()], error: null, count: 49 });
    const featured = makeProductRow({ id: 2, name: "Featured", is_featured: true });
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        products: [productsQuery, createSupabaseQuery({ data: [featured], error: null })],
        businesses: [createSupabaseQuery({ data: businessRow, error: null })],
      }),
    );

    render(await CatalogPage(props("7", { page: "2", sort: "price-desc", q: "Demo" })));

    expect(productsQuery.or).toHaveBeenCalledWith(
      'name.ilike."%Demo%",description.ilike."%Demo%"',
    );
    expect(productsQuery.order).toHaveBeenNthCalledWith(1, "price", { ascending: false });
    expect(productsQuery.order).toHaveBeenNthCalledWith(2, "id", { ascending: false });
    expect(productsQuery.range).toHaveBeenCalledWith(24, 47);
    expect(mocks.browser).toHaveBeenCalledWith(
      expect.objectContaining({
        businessId: 7,
        currentPage: 2,
        totalPages: 3,
        sort: "price-desc",
        searchQuery: "Demo",
        products: [expect.objectContaining({ id: 1 })],
        featuredProducts: [expect.objectContaining({ id: 2 })],
      }),
      undefined,
    );
    expect(mocks.summary).toHaveBeenCalledWith(
      expect.objectContaining({ location: "Santo Domingo, Dominican Republic" }),
      undefined,
    );
  });

  it("redirects redundant default parameters to one clean URL", async () => {
    await expect(
      CatalogPage(props("7", { page: "2", sort: "created-desc", q: "demo" })),
    ).rejects.toThrow("NEXT_REDIRECT:/catalog/7?page=2&q=demo");
    expect(mocks.createClient).not.toHaveBeenCalled();

    await expect(CatalogPage(props("7", { q: "   " }))).rejects.toThrow(
      "NEXT_REDIRECT:/catalog/7",
    );
  });

  it("returns not found when a requested page is beyond the product count", async () => {
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        products: [
          createSupabaseQuery({ data: [], error: null, count: 24 }),
          createSupabaseQuery({ data: [], error: null }),
        ],
        businesses: [createSupabaseQuery({ data: businessRow, error: null })],
      }),
    );

    await expect(CatalogPage(props("7", { page: "2" }))).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
