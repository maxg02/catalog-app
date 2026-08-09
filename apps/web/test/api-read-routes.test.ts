import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProductRow } from "@/test/fixtures";
import { createSupabaseMock, createSupabaseQuery } from "@/test/supabase-mock";
import { GET as getInsights } from "@/app/api/business/[id]/insights/route";
import { GET as getBusinessProducts } from "@/app/api/business/[id]/products/route";
import { GET as getProduct } from "@/app/api/products/[id]/route";
import { GET as getBusiness } from "@/app/api/business/[id]/route";
import { GET as getProfile } from "@/app/api/users/[id]/profile/route";

const server = vi.hoisted(() => ({ createClient: vi.fn(), cookies: vi.fn(async () => ({})) }));

vi.mock("@/utils/supabase/server", () => ({ createClient: server.createClient }));
vi.mock("next/headers", () => ({ cookies: server.cookies }));

const request = new Request("http://localhost/api");
const context = (id: string) => ({ params: Promise.resolve({ id }) });

const businessRow = {
  id: 3,
  name: "Demo Store",
  description: "Store description",
  category: 1,
  location: null,
  user_id: 2,
  business_images: [{ image_url: "https://images.example/banner.jpg" }],
};

beforeEach(() => server.createClient.mockReset());

describe("read API routes", () => {
  it("validates insight ids and returns the public insight contract", async () => {
    const invalid = await getInsights(request, context("0"));
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toEqual({ error: "Invalid business id" });

    const response = await getInsights(request, context("1"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.any(Object));
  });

  it("returns catalog products in newest-first query order", async () => {
    const productsQuery = createSupabaseQuery({
      data: [makeProductRow({ product_images: [{ id: 1, image_url: "main.jpg", product_id: 1, is_main: true }] })],
      error: null,
    });
    server.createClient.mockReturnValue(createSupabaseMock({ products: [productsQuery] }));

    const response = await getBusinessProducts(request, context("3"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([
      expect.objectContaining({ id: 1, name: "Demo product", mainImage: "main.jpg" }),
    ]);
    expect(productsQuery.eq).toHaveBeenCalledWith("business_id", 3);
    expect(productsQuery.order).toHaveBeenCalledWith("creation_date", { ascending: false });
  });

  it("returns a stable server error contract when catalog products cannot be read", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    server.createClient.mockReturnValue(
      createSupabaseMock({
        products: [createSupabaseQuery({ data: null, error: { message: "database unavailable" } })],
      }),
    );

    const response = await getBusinessProducts(request, context("3"));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "Error fetching business products" });
  });

  it("distinguishes a missing product from a successful product response", async () => {
    server.createClient.mockReturnValueOnce(
      createSupabaseMock({ products: [createSupabaseQuery({ data: null, error: null })] }),
    );
    const missing = await getProduct(request, context("9"));
    expect(missing.status).toBe(404);

    server.createClient.mockReturnValueOnce(
      createSupabaseMock({ products: [createSupabaseQuery({ data: makeProductRow(), error: null })] }),
    );
    const found = await getProduct(request, context("1"));
    expect(found.status).toBe(200);
    expect(await found.json()).toEqual(expect.objectContaining({ id: 1, businessId: 1 }));
  });

  it("maps a public business and returns 404 when it does not exist", async () => {
    server.createClient.mockReturnValueOnce(
      createSupabaseMock({ businesses: [createSupabaseQuery({ data: businessRow, error: null })] }),
    );
    const found = await getBusiness(request, context("3"));
    expect(await found.json()).toEqual(
      expect.objectContaining({ id: 3, category: 0, bannerImage: "https://images.example/banner.jpg" }),
    );

    server.createClient.mockReturnValueOnce(
      createSupabaseMock({ businesses: [createSupabaseQuery({ data: null, error: null })] }),
    );
    expect((await getBusiness(request, context("99"))).status).toBe(404);
  });

  it("returns the user and ordered businesses in the profile contract", async () => {
    const businessesQuery = createSupabaseQuery({ data: [businessRow], error: null });
    server.createClient.mockReturnValue(
      createSupabaseMock({
        users: [createSupabaseQuery({ data: { id: 2, name: "Ada", email: "ada@example.com", role: 1 }, error: null })],
        businesses: [businessesQuery],
      }),
    );

    const response = await getProfile(request, context("2"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      user: { id: 2, name: "Ada", email: "ada@example.com", role: 1 },
      businesses: [expect.objectContaining({ id: 3, name: "Demo Store" })],
    });
    expect(businessesQuery.order).toHaveBeenCalledWith("id", { ascending: true });
  });
});
