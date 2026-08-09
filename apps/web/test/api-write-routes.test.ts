import { beforeEach, describe, expect, it, vi } from "vitest";
import { makeProductRow } from "@/test/fixtures";
import { createSupabaseMock, createSupabaseQuery } from "@/test/supabase-mock";
import { POST as createProduct } from "@/app/api/business/[id]/products/route";
import { DELETE as deleteProduct, PUT as updateProduct } from "@/app/api/products/[id]/route";
import { POST as createBusiness } from "@/app/api/users/[id]/businesses/route";
import { DELETE as deleteBusiness, PUT as updateBusiness } from "@/app/api/business/[id]/route";
import { PUT as updateUser } from "@/app/api/users/[id]/route";

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
  cookies: vi.fn(async () => ({})),
  hash: vi.fn(async () => "hashed-password"),
  syncBusinessBanner: vi.fn(async () => undefined),
  parseProductBody: vi.fn(),
  validateProductBody: vi.fn(),
  uploadImagesToR2: vi.fn(async (): Promise<Array<{ key: string; url: string }>> => []),
  deleteUploadedImages: vi.fn(async () => undefined),
  deleteImageUrlsFromR2: vi.fn(async () => undefined),
}));

vi.mock("@/utils/supabase/server", () => ({ createClient: mocks.createClient }));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("bcrypt", () => ({ hash: mocks.hash }));
vi.mock("@/lib/business/banners/banner", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/business/banners/banner")>();
  return { ...original, syncBusinessBanner: mocks.syncBusinessBanner };
});
vi.mock("@/lib/products/productRequest", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/products/productRequest")>();
  return {
    ...original,
    parseProductBody: mocks.parseProductBody,
    validateProductBody: mocks.validateProductBody,
    uploadImagesToR2: mocks.uploadImagesToR2,
    deleteUploadedImages: mocks.deleteUploadedImages,
    deleteImageUrlsFromR2: mocks.deleteImageUrlsFromR2,
  };
});

const context = (id: string) => ({ params: Promise.resolve({ id }) });
const jsonRequest = (body: unknown) =>
  new Request("http://localhost/api", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const productInput = {
  name: "Updated product",
  price: 30,
  description: "Updated description",
  details: {},
  isPublic: true,
  onStock: true,
  isFeatured: false,
  sale: false,
  salePrice: null,
  saleEndDate: null,
  mainImageIndex: 0,
  existingImages: [],
  images: [],
};

const businessRow = {
  id: 3,
  name: "Demo Store",
  description: null,
  category: null,
  location: null,
  user_id: 2,
  business_images: [],
};

beforeEach(() => {
  vi.clearAllMocks();
  mocks.parseProductBody.mockResolvedValue({ name: "input" });
  mocks.validateProductBody.mockReturnValue({ ok: true, product: productInput });
  mocks.uploadImagesToR2.mockResolvedValue([]);
});

describe("product write routes", () => {
  it("creates and refetches a product", async () => {
    const inserted = makeProductRow({ name: "Updated product", price: 30, description: "Updated description" });
    const insertQuery = createSupabaseQuery({ data: inserted, error: null });
    mocks.createClient.mockReturnValue(
      createSupabaseMock({ products: [insertQuery, createSupabaseQuery({ data: inserted, error: null })] }),
    );

    const response = await createProduct(jsonRequest({}), context("3"));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(expect.objectContaining({ name: "Updated product", price: 30 }));
    expect(insertQuery.insert).toHaveBeenCalledWith(expect.objectContaining({ business_id: 3 }));
  });

  it("updates a product and replaces its image rows", async () => {
    const current = makeProductRow();
    const updated = makeProductRow({ name: "Updated product", price: 30, description: "Updated description" });
    const updateQuery = createSupabaseQuery({ data: updated, error: null });
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        products: [
          createSupabaseQuery({ data: current, error: null }),
          updateQuery,
          createSupabaseQuery({ data: updated, error: null }),
        ],
        product_images: [createSupabaseQuery({ error: null })],
      }),
    );

    const response = await updateProduct(jsonRequest({}), context("1"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(expect.objectContaining({ name: "Updated product" }));
    expect(updateQuery.update).toHaveBeenCalledWith(expect.objectContaining({ name: "Updated product" }));
  });

  it("deletes a product and schedules its stored images for deletion", async () => {
    const current = makeProductRow({
      product_images: [{ id: 1, product_id: 1, image_url: "https://images.example/one.jpg", is_main: true }],
    });
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        products: [
          createSupabaseQuery({ data: current, error: null }),
          createSupabaseQuery({ error: null }),
        ],
      }),
    );

    const response = await deleteProduct(jsonRequest({}), context("1"));
    expect(response.status).toBe(204);
    expect(mocks.deleteImageUrlsFromR2).toHaveBeenCalledWith(["https://images.example/one.jpg"]);
  });

  it("returns field errors before accessing the database", async () => {
    mocks.validateProductBody.mockReturnValue({ ok: false, fieldErrors: { name: "Required" } });
    const response = await createProduct(jsonRequest({}), context("3"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(
      expect.objectContaining({ fieldErrors: { name: "Required" } }),
    );
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("returns an upload error without querying Supabase", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    mocks.uploadImagesToR2.mockRejectedValueOnce(new Error("R2 unavailable"));

    const response = await createProduct(jsonRequest({}), context("3"));
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Unable to upload product images." });
    expect(mocks.deleteUploadedImages).toHaveBeenCalledWith([]);
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("cleans up uploaded objects when the product insert fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const uploaded = { key: "products/3/image.jpg", url: "https://images.example/image.jpg" };
    mocks.uploadImagesToR2.mockResolvedValueOnce([uploaded]);
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        products: [createSupabaseQuery({ data: null, error: { message: "insert failed" } })],
      }),
    );

    const response = await createProduct(jsonRequest({}), context("3"));
    expect(response.status).toBe(500);
    expect(mocks.deleteUploadedImages).toHaveBeenCalledWith([uploaded]);
  });
});

describe("business write routes", () => {
  it("creates a business, synchronizes its banner, and returns the DTO", async () => {
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        businesses: [
          createSupabaseQuery({ data: { id: 3 }, error: null }),
          createSupabaseQuery({ data: businessRow, error: null }),
        ],
      }),
    );

    const response = await createBusiness(jsonRequest({ name: "Demo Store" }), context("2"));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(expect.objectContaining({ id: 3, name: "Demo Store" }));
    expect(mocks.syncBusinessBanner).toHaveBeenCalledWith(expect.any(Object), 3, {
      action: "remove",
      image: null,
    });
  });

  it("updates and refetches a business", async () => {
    const updateQuery = createSupabaseQuery({ data: { id: 3 }, error: null });
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        businesses: [updateQuery, createSupabaseQuery({ data: businessRow, error: null })],
      }),
    );

    const response = await updateBusiness(jsonRequest({ name: "Demo Store" }), context("3"));
    expect(response.status).toBe(200);
    expect(updateQuery.eq).toHaveBeenCalledWith("user_id", 1);
  });

  it("deletes an owned business and its banner object", async () => {
    const selectRow = { id: 3, business_images: [{ image_url: "https://images.example/banner.jpg" }] };
    mocks.createClient.mockReturnValue(
      createSupabaseMock({
        businesses: [
          createSupabaseQuery({ data: selectRow, error: null }),
          createSupabaseQuery({ error: null }),
        ],
      }),
    );

    const response = await deleteBusiness(jsonRequest({}), context("3"));
    expect(response.status).toBe(204);
    expect(mocks.deleteImageUrlsFromR2).toHaveBeenCalledWith(["https://images.example/banner.jpg"]);
  });
});

describe("user write route", () => {
  it("validates fields without querying Supabase", async () => {
    const response = await updateUser(jsonRequest({ name: "", email: "invalid" }), context("2"));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual(
      expect.objectContaining({ fieldErrors: { name: "Name is required.", email: "Valid email is required." } }),
    );
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("hashes an optional valid password and returns the updated user", async () => {
    const updateQuery = createSupabaseQuery({
      data: { id: 2, name: "Ada", email: "ada@example.com", role: 1 },
      error: null,
    });
    mocks.createClient.mockReturnValue(createSupabaseMock({ users: [updateQuery] }));

    const response = await updateUser(
      jsonRequest({ name: " Ada ", email: " ada@example.com ", password: "Password1" }),
      context("2"),
    );
    expect(response.status).toBe(200);
    expect(mocks.hash).toHaveBeenCalledWith("Password1", 10);
    expect(updateQuery.update).toHaveBeenCalledWith({
      name: "Ada",
      email: "ada@example.com",
      password: "hashed-password",
    });
  });
});
