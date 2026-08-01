import type { ProductDto } from "@internal/interfaces";
import {
    addProductImages,
    deleteProductImage,
    getAssetName,
    getDetailsRecord,
    getProductFormValues,
    getProductImages,
    getProductSubmitValues,
    getSubmitErrorData,
    parsePrice,
    validateSalePrice,
    type ProductFormValues,
    type ProductImageAsset,
} from "./productLogic";

const image = (uri: string, isExisting = false): ProductImageAsset => ({
    uri,
    name: `${uri}.jpg`,
    type: "image/jpeg",
    isExisting,
});
const values: ProductFormValues = {
    name: " Product ",
    price: "12,50",
    description: " Description ",
    details: [],
    onStock: true,
    isFeatured: false,
    visibility: "draft",
    sale: true,
    salePrice: "9.5",
    saleEndDate: new Date("2026-08-01T12:00:00.000Z"),
};

describe("product logic", () => {
    test.each([["12.5", 12.5], ["12,5", 12.5], ["", 0], ["wat", Number.NaN]])(
        "parses decimal %s",
        (input, expected) => expect(parsePrice(input)).toEqual(expected),
    );

    it("maps details and reports incomplete or duplicate entries", () => {
        expect(getDetailsRecord([{ title: " Color ", description: " Blue " }, { title: "", description: "" }])).toEqual({
            value: { Color: "Blue" },
            errors: [],
        });
        expect(
            getDetailsRecord([
                { title: "Size", description: "" },
                { title: "", description: "Large" },
                { title: "Size", description: "Medium" },
            ]).errors,
        ).toEqual([
            { index: 0, field: "description", message: "Detail description is required." },
            { index: 1, field: "title", message: "Detail title is required." },
            { index: 2, field: "title", message: "Detail title must be unique." },
        ]);
    });

    it("validates sale prices and maps normalized submit payloads", () => {
        expect(validateSalePrice(false, "")).toBeNull();
        expect(validateSalePrice(true, "0")).toBe("Sale price must be greater than 0.");
        expect(validateSalePrice(true, "x")).toBe("Sale price must be greater than 0.");
        expect(validateSalePrice(true, "1,5")).toBeNull();
        expect(getProductSubmitValues(values, { Color: "Blue" }, true, [image("new")], 0)).toEqual({
            name: "Product",
            price: 12.5,
            description: "Description",
            details: { Color: "Blue" },
            isPublic: false,
            onStock: true,
            isFeatured: false,
            sale: true,
            salePrice: 9.5,
            saleEndDate: "2026-08-01T12:00:00.000Z",
            images: [image("new")],
            mainImageIndex: 0,
        });
        expect(getProductSubmitValues(values, {}, false, [], null)).toMatchObject({
            sale: false,
            salePrice: null,
            saleEndDate: null,
        });
    });

    it("maps product DTO fields and existing images", () => {
        const product = {
            name: "P",
            price: 4,
            description: "D",
            details: { Size: "M" },
            onStock: false,
            isFeatured: true,
            isPublic: true,
            sale: true,
            salePrice: 3,
            saleEndDate: "2026-08-01T00:00:00.000Z",
            image: ["one", "two"],
        } as unknown as ProductDto;
        expect(getProductFormValues(product)).toMatchObject({
            price: "4",
            details: [{ title: "Size", description: "M" }],
            visibility: "public",
            salePrice: "3",
        });
        expect(getProductImages(product)).toEqual([
            { uri: "one", name: "product-image-1.jpg", type: "image/jpeg", isExisting: true },
            { uri: "two", name: "product-image-2.jpg", type: "image/jpeg", isExisting: true },
        ]);
    });

    it("limits additions, defaults main image, and rebases deletion", () => {
        expect(addProductImages([image("1")], [image("2"), image("3")], 2)).toEqual({
            images: [image("1"), image("2")],
            defaultMainImageIndex: 0,
        });
        expect(deleteProductImage([image("1"), image("2"), image("3")], 2, 0)).toEqual({
            images: [image("2"), image("3")],
            mainImageIndex: 1,
        });
        expect(deleteProductImage([image("1"), image("2")], 1, 1).mainImageIndex).toBe(0);
        expect(deleteProductImage([image("1")], 0, 0).mainImageIndex).toBeNull();
        expect(getAssetName("file:///a/p.png", 0)).toBe("p.png");
        expect(getAssetName("", 2)).toBe("product-image-3.jpg");
    });

    it("parses server error envelopes", () => {
        expect(getSubmitErrorData({ data: { error: "bad" } })).toEqual({ error: "bad" });
        expect(getSubmitErrorData({ data: null })).toBeUndefined();
    });
});
