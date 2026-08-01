import type { ProductDto } from "@internal/interfaces";

export type ProductImageAsset = {
    uri: string;
    name: string;
    type: string;
    isExisting?: boolean;
};

export type ProductDetail = { title: string; description: string };
export type ProductVisibility = "public" | "draft";

export type ProductFormValues = {
    name: string;
    price: string;
    description: string;
    details: ProductDetail[];
    onStock: boolean;
    isFeatured: boolean;
    visibility: ProductVisibility;
    sale: boolean;
    salePrice: string;
    saleEndDate: Date | null;
};

export type ProductFormSubmitValues = {
    name: string;
    price: number;
    description: string;
    details: Record<string, string>;
    isPublic: boolean;
    onStock: boolean;
    isFeatured: boolean;
    sale: boolean;
    salePrice: number | null;
    saleEndDate: string | null;
    images: ProductImageAsset[];
    mainImageIndex: number | null;
};

export type ProductDetailError = { index: number; field: "title" | "description"; message: string };

export function parsePrice(value: string) {
    return Number(value.replace(",", "."));
}

export function getSubmitErrorData<T>(error: unknown) {
    if (typeof error !== "object" || !error || !("data" in error)) return undefined;
    const data = (error as { data?: unknown }).data;
    return typeof data === "object" && data ? (data as T) : undefined;
}

export function getDetailsRecord(details: ProductDetail[]) {
    const value: Record<string, string> = {};
    const titles = new Set<string>();
    const errors: ProductDetailError[] = [];

    details.forEach((detail, index) => {
        const title = detail.title.trim();
        const description = detail.description.trim();
        if (!title && !description) return;
        if (!title) errors.push({ index, field: "title", message: "Detail title is required." });
        if (!description) errors.push({ index, field: "description", message: "Detail description is required." });
        if (title && titles.has(title)) errors.push({ index, field: "title", message: "Detail title must be unique." });
        titles.add(title);
        if (title && description) value[title] = description;
    });

    return { value, errors };
}

export function validateSalePrice(enabled: boolean, value: string) {
    const price = enabled ? parsePrice(value) : null;
    return enabled && (price === null || !Number.isFinite(price) || price <= 0)
        ? "Sale price must be greater than 0."
        : null;
}

export function getProductSubmitValues(
    values: ProductFormValues,
    details: Record<string, string>,
    showSaleFields: boolean,
    images: ProductImageAsset[],
    mainImageIndex: number | null,
): ProductFormSubmitValues {
    return {
        name: values.name.trim(),
        price: parsePrice(values.price),
        description: values.description.trim(),
        details,
        isPublic: values.visibility === "public",
        onStock: values.onStock,
        isFeatured: values.isFeatured,
        sale: showSaleFields ? values.sale : false,
        salePrice: showSaleFields && values.sale ? parsePrice(values.salePrice) : null,
        saleEndDate: showSaleFields && values.saleEndDate ? values.saleEndDate.toISOString() : null,
        images,
        mainImageIndex,
    };
}

export function getProductFormValues(product: ProductDto): ProductFormValues {
    return {
        name: product.name,
        price: String(product.price),
        description: product.description,
        details: Object.entries(product.details).map(([title, description]) => ({ title, description })),
        onStock: product.onStock,
        isFeatured: product.isFeatured,
        visibility: product.isPublic ? "public" : "draft",
        sale: product.sale,
        salePrice: product.salePrice == null ? "" : String(product.salePrice),
        saleEndDate: product.saleEndDate ? new Date(product.saleEndDate) : null,
    };
}

export function getProductImages(product: ProductDto): ProductImageAsset[] {
    return product.image.map((uri, index) => ({
        uri,
        name: `product-image-${index + 1}.jpg`,
        type: "image/jpeg",
        isExisting: true,
    }));
}

export function getAssetName(uri: string, index: number) {
    return uri.split("/").pop() || `product-image-${index + 1}.jpg`;
}

export function addProductImages(images: ProductImageAsset[], added: ProductImageAsset[], limit = 4) {
    const nextImages = [...images, ...added].slice(0, limit);
    return { images: nextImages, defaultMainImageIndex: nextImages.length ? 0 : null };
}

export function deleteProductImage(images: ProductImageAsset[], mainImageIndex: number | null, selectedIndex: number) {
    const nextImages = images.filter((_, index) => index !== selectedIndex);
    const nextMainImageIndex = !nextImages.length
        ? null
        : mainImageIndex === selectedIndex
          ? 0
          : mainImageIndex !== null && selectedIndex < mainImageIndex
            ? mainImageIndex - 1
            : mainImageIndex;
    return { images: nextImages, mainImageIndex: nextMainImageIndex };
}
