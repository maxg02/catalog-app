import { afterEach, describe, expect, it, vi } from "vitest";
import {
  parseProductBody,
  uploadImagesToR2,
  validateProductBody,
  type ProductBody,
} from "./productRequest";

const validBody: ProductBody = {
  name: " Demo product ",
  price: "25.50",
  description: " Description ",
  details: JSON.stringify({ Color: " Blue " }),
  isPublic: "true",
  onStock: "false",
  isFeatured: "true",
  sale: "false",
  mainImageIndex: "0",
  images: [],
};

afterEach(() => vi.unstubAllEnvs());

describe("parseProductBody", () => {
  it("parses object JSON and rejects array JSON", async () => {
    const request = new Request("http://test/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(validBody),
    });
    expect(await parseProductBody(request)).toMatchObject({ name: " Demo product " });

    const arrayRequest = new Request("http://test/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "[]",
    });
    expect(await parseProductBody(arrayRequest)).toBeNull();
  });

  it("parses multipart values and files", async () => {
    const form = new FormData();
    form.set("name", "Demo");
    form.set("price", "10");
    form.set("isPublic", "true");
    form.append("images", new File(["image"], "product.png", { type: "image/png" }));
    const request = {
      headers: new Headers({ "content-type": "multipart/form-data; boundary=test" }),
      formData: vi.fn().mockResolvedValue(form),
    } as unknown as Request;
    const parsed = await parseProductBody(request);
    expect(parsed?.name).toBe("Demo");
    expect(parsed?.images).toHaveLength(1);
  });
});

describe("validateProductBody", () => {
  it("normalizes a valid product", () => {
    expect(validateProductBody(validBody)).toEqual({
      ok: true,
      product: {
        name: "Demo product",
        price: 25.5,
        description: "Description",
        details: { Color: "Blue" },
        isPublic: true,
        onStock: false,
        isFeatured: true,
        sale: false,
        salePrice: null,
        saleEndDate: null,
        mainImageIndex: 0,
        existingImages: [],
        images: [],
      },
    });
  });

  it("reports required and boolean field errors", () => {
    const result = validateProductBody({ name: "", price: "0", description: "" });
    expect(result).toMatchObject({
      ok: false,
      fieldErrors: {
        name: "Product name is required.",
        price: "Price must be greater than 0.",
        description: "Description is required.",
        isPublic: "Visibility is required.",
        onStock: "Stock status is required.",
        isFeatured: "Featured status is required.",
      },
    });
  });

  it("validates sales, details, existing images, and the main image", () => {
    expect(
      validateProductBody({ ...validBody, sale: true, salePrice: 0, saleEndDate: "invalid" }),
    ).toMatchObject({
      ok: false,
      fieldErrors: {
        salePrice: "Sale price must be greater than 0.",
        saleEndDate: "Sale end date is invalid.",
      },
    });
    expect(validateProductBody({ ...validBody, details: "not-json" })).toMatchObject({
      ok: false,
      fieldErrors: { details: "Details must be a record." },
    });
    expect(
      validateProductBody(
        { ...validBody, existingImages: JSON.stringify(["one"]), mainImageIndex: 1 },
        { allowExistingImages: true },
      ),
    ).toMatchObject({
      ok: false,
      fieldErrors: { mainImageIndex: "Main image selection is invalid." },
    });
  });

  it("rejects unsupported, oversized, and excessive images", () => {
    const unsupported = new File(["file"], "product.txt", { type: "text/plain" });
    expect(validateProductBody({ ...validBody, images: [unsupported] })).toMatchObject({
      ok: false,
      fieldErrors: { images: "Images must be JPEG, PNG, WebP, or GIF files." },
    });

    const oversized = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "product.jpg", {
      type: "image/jpeg",
    });
    expect(validateProductBody({ ...validBody, images: [oversized] })).toMatchObject({
      ok: false,
      fieldErrors: { images: "Each image must be 5MB or smaller." },
    });

    const images = Array.from({ length: 5 }, (_, index) =>
      new File(["x"], `${index}.png`, { type: "image/png" }),
    );
    expect(validateProductBody({ ...validBody, images })).toMatchObject({
      ok: false,
      fieldErrors: { images: "Products can have up to 4 images." },
    });
  });
});

describe("uploadImagesToR2", () => {
  it("does nothing for an empty image list and requires configuration otherwise", async () => {
    await expect(uploadImagesToR2(1, [])).resolves.toEqual([]);
    vi.stubEnv("NEXT_R2_ACCOUNT_ID", "");
    await expect(
      uploadImagesToR2(1, [new File(["x"], "product.png", { type: "image/png" })]),
    ).rejects.toThrow("R2 is not configured.");
  });
});
