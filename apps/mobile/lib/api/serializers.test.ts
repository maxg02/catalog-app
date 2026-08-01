import { BusinessCategories } from "@internal/enums";
import { getBusinessFormData, type BusinessMutationPayload } from "@/features/profile/api/profileApi";
import { getProductFormData, type ProductMutationPayload } from "@/features/catalog/api/catalogApi";

class TestFormData {
    _parts: [string, unknown][] = [];
    append(key: string, value: unknown) { this._parts.push([key, value]); }
}

beforeAll(() => { global.FormData = TestFormData as unknown as typeof FormData; });

const parts = (data: FormData) => (data as unknown as TestFormData)._parts;
const product = (images: ProductMutationPayload["images"]): ProductMutationPayload => ({
    name: "Product",
    price: 12.5,
    description: "Description",
    details: { Color: "Blue" },
    isPublic: true,
    onStock: false,
    isFeatured: true,
    sale: true,
    salePrice: 10,
    saleEndDate: "2026-08-01T00:00:00.000Z",
    images,
    mainImageIndex: 1,
});
const business = (bannerImage: BusinessMutationPayload["bannerImage"]): BusinessMutationPayload => ({
    name: "Shop",
    description: null,
    category: BusinessCategories.FOOD,
    location: null,
    bannerImage,
});

describe("multipart serializers", () => {
    test.each([
        [null, "remove"],
        [{ uri: "old", name: "old.jpg", type: "image/jpeg", isExisting: true }, "keep"],
        [{ uri: "new", name: "new.jpg", type: "image/jpeg" }, "replace"],
    ] as const)("maps business banner action", (banner, action) => {
        const data = parts(getBusinessFormData(business(banner)));
        expect(data).toContainEqual(["bannerAction", action]);
        expect(data).toContainEqual(["location", "null"]);
        expect(data.some(([key]) => key === "bannerImage")).toBe(action === "replace");
    });

    it("keeps existing product images only on update and appends new files", () => {
        const images = [
            { uri: "old", name: "old.jpg", type: "image/jpeg", isExisting: true },
            { uri: "new", name: "new.jpg", type: "image/png" },
        ];
        const createParts = parts(getProductFormData(product(images), { includeExistingImages: false }));
        const updateParts = parts(getProductFormData(product(images), { includeExistingImages: true }));

        expect(createParts).toContainEqual(["existingImages", "[]"]);
        expect(updateParts).toContainEqual(["existingImages", '["old"]']);
        expect(updateParts).toContainEqual(["mainImageIndex", "1"]);
        expect(updateParts.filter(([key]) => key === "images")).toEqual([
            ["images", { uri: "new", name: "new.jpg", type: "image/png" }],
        ]);
    });
});
