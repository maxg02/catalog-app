import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const MAX_DETAILS = 10;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type ProductBody = {
    name?: unknown;
    price?: unknown;
    description?: unknown;
    details?: unknown;
    isPublic?: unknown;
    onStock?: unknown;
    isFeatured?: unknown;
    sale?: unknown;
    salePrice?: unknown;
    saleEndDate?: unknown;
    mainImageIndex?: unknown;
    existingImages?: unknown;
    images?: File[];
};

type ParsedProductBody = {
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
    mainImageIndex: number;
    existingImages: string[];
    images: File[];
};

type UploadedImage = {
    key: string;
    url: string;
};

type FieldErrors = Partial<Record<keyof ProductBody, string>>;

type ProductRequestResult =
    | { ok: true; product: ParsedProductBody }
    | { ok: false; fieldErrors: FieldErrors };

let r2Client: S3Client | null = null;

function parseBoolean(value: unknown) {
    if (typeof value === "boolean") return value;
    if (value === "true") return true;
    if (value === "false") return false;
    return null;
}

function parseDetails(value: unknown, fieldErrors: FieldErrors) {
    if (value === undefined || value === null || value === "") return {};

    let detailsValue: unknown = value;

    if (typeof value === "string") {
        try {
            detailsValue = JSON.parse(value) as unknown;
        } catch {
            fieldErrors.details = "Details must be a record.";
            return {};
        }
    }

    if (typeof detailsValue !== "object" || !detailsValue || Array.isArray(detailsValue)) {
        fieldErrors.details = "Details must be a record.";
        return {};
    }

    const entries = Object.entries(detailsValue as Record<string, unknown>);
    const details: Record<string, string> = {};
    const titles = new Set<string>();

    if (entries.length > MAX_DETAILS) {
        fieldErrors.details = "Products can have up to 10 details.";
        return details;
    }

    for (const [rawTitle, rawDescription] of entries) {
        const title = rawTitle.trim();
        const description = typeof rawDescription === "string" ? rawDescription.trim() : "";

        if (!title || !description || titles.has(title)) {
            fieldErrors.details = "Details must have unique titles and descriptions.";
            return details;
        }

        titles.add(title);
        details[title] = description;
    }

    return details;
}

function parseStringArray(value: unknown, fieldErrors: FieldErrors) {
    if (value === undefined || value === null || value === "") return [];

    let parsed: unknown = value;

    if (typeof value === "string") {
        try {
            parsed = JSON.parse(value) as unknown;
        } catch {
            fieldErrors.existingImages = "Existing images must be a string array.";
            return [];
        }
    }

    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
        fieldErrors.existingImages = "Existing images must be a string array.";
        return [];
    }

    return parsed as string[];
}

function parseNumber(value: unknown) {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim()) return Number(value.trim());
    return NaN;
}

function parseOptionalDate(value: unknown, fieldErrors: FieldErrors) {
    if (value === undefined || value === null || value === "") return null;
    if (typeof value !== "string") {
        fieldErrors.saleEndDate = "Sale end date is invalid.";
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        fieldErrors.saleEndDate = "Sale end date is invalid.";
        return null;
    }

    return date.toISOString();
}

async function parseProductBody(request: Request): Promise<ProductBody | null> {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        const images = formData.getAll("images").filter((value): value is File => value instanceof File);

        return {
            name: formData.get("name"),
            price: formData.get("price"),
            description: formData.get("description"),
            details: formData.get("details"),
            isPublic: formData.get("isPublic"),
            onStock: formData.get("onStock"),
            isFeatured: formData.get("isFeatured"),
            sale: formData.get("sale"),
            salePrice: formData.get("salePrice"),
            saleEndDate: formData.get("saleEndDate"),
            existingImages: formData.get("existingImages"),
            mainImageIndex: formData.get("mainImageIndex"),
            images,
        };
    }

    const json = await request.json();

    return json && typeof json === "object" && !Array.isArray(json) ? (json as ProductBody) : null;
}

function validateProductBody(body: ProductBody, options: { allowExistingImages?: boolean } = {}): ProductRequestResult {
    const fieldErrors: FieldErrors = {};
    const images = body.images ?? [];
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const rawPrice = typeof body.price === "string" ? body.price.trim() : body.price;
    const price = parseNumber(rawPrice);
    const details = parseDetails(body.details, fieldErrors);
    const isPublic = parseBoolean(body.isPublic);
    const onStock = parseBoolean(body.onStock);
    const isFeatured = parseBoolean(body.isFeatured);
    const sale = parseBoolean(body.sale) ?? false;
    const salePrice = sale ? parseNumber(body.salePrice) : null;
    const saleEndDate = sale ? parseOptionalDate(body.saleEndDate, fieldErrors) : null;
    const existingImages = options.allowExistingImages
        ? parseStringArray(body.existingImages, fieldErrors)
        : [];
    const rawMainImageIndex = parseNumber(body.mainImageIndex ?? 0);
    const imageCount = existingImages.length + images.length;

    if (!name) fieldErrors.name = "Product name is required.";

    if (rawPrice === undefined || rawPrice === null || rawPrice === "") {
        fieldErrors.price = "Price is required.";
    } else if (!Number.isFinite(price) || price <= 0) {
        fieldErrors.price = "Price must be greater than 0.";
    }

    if (!description) fieldErrors.description = "Description is required.";
    if (isPublic === null) fieldErrors.isPublic = "Visibility is required.";
    if (onStock === null) fieldErrors.onStock = "Stock status is required.";
    if (isFeatured === null) fieldErrors.isFeatured = "Featured status is required.";

    if (sale && (salePrice === null || !Number.isFinite(salePrice) || salePrice <= 0)) {
        fieldErrors.salePrice = "Sale price must be greater than 0.";
    }

    if (imageCount > MAX_IMAGES) fieldErrors.images = `Products can have up to ${MAX_IMAGES} images.`;
    if (images.some((image) => !IMAGE_TYPES.has(image.type))) {
        fieldErrors.images = "Images must be JPEG, PNG, WebP, or GIF files.";
    }
    if (images.some((image) => image.size > MAX_IMAGE_SIZE)) {
        fieldErrors.images = "Each image must be 5MB or smaller.";
    }
    if (
        imageCount > 0 &&
        (!Number.isInteger(rawMainImageIndex) || rawMainImageIndex < 0 || rawMainImageIndex >= imageCount)
    ) {
        fieldErrors.mainImageIndex = "Main image selection is invalid.";
    }

    if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

    return {
        ok: true,
        product: {
            name,
            price,
            description,
            details,
            isPublic: isPublic === true,
            onStock: onStock === true,
            isFeatured: isFeatured === true,
            sale,
            salePrice: sale ? salePrice : null,
            saleEndDate,
            mainImageIndex: Number.isInteger(rawMainImageIndex) ? rawMainImageIndex : 0,
            existingImages,
            images,
        },
    };
}

function getR2Config() {
    const accountId = process.env.NEXT_R2_ACCOUNT_ID;
    const accessKeyId = process.env.NEXT_R2_ACCESS_KEY;
    const secretAccessKey = process.env.NEXT_R2_SECRET_ACCESS_KEY;
    const bucket = process.env.NEXT_R2_BUCKET_NAME;
    const publicBaseUrl = process.env.NEXT_R2_PUBLIC_BASE_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) return null;

    return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

function getR2Client() {
    const config = getR2Config();

    if (!config) return null;

    r2Client ??= new S3Client({
        region: "auto",
        endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
        },
    });

    return { client: r2Client, bucket: config.bucket, publicBaseUrl: config.publicBaseUrl };
}

function getFileExtension(file: File) {
    const fileNameExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileNameExtension && /^[a-z0-9]+$/.test(fileNameExtension)) return fileNameExtension;

    return file.type.split("/")[1] || "jpg";
}

async function uploadImagesToR2(businessId: number, images: File[]) {
    if (images.length === 0) return [];

    const r2 = getR2Client();

    if (!r2) throw new Error("R2 is not configured.");

    const uploadedImages: UploadedImage[] = [];

    try {
        for (const [index, image] of images.entries()) {
            const key = `products/${businessId}/${randomUUID()}-${index}.${getFileExtension(image)}`;
            const body = new Uint8Array(await image.arrayBuffer());

            await r2.client.send(
                new PutObjectCommand({
                    Bucket: r2.bucket,
                    Key: key,
                    Body: body,
                    ContentType: image.type,
                }),
            );

            uploadedImages.push({
                key,
                url: `${r2.publicBaseUrl.replace(/\/$/, "")}/${key}`,
            });
        }

        return uploadedImages;
    } catch (error) {
        await deleteUploadedImages(uploadedImages);
        throw error;
    }
}

function getR2KeyFromUrl(url: string) {
    const config = getR2Config();

    if (!config) return null;

    const baseUrl = config.publicBaseUrl.replace(/\/$/, "");

    if (!url.startsWith(`${baseUrl}/`)) return null;

    return url.slice(baseUrl.length + 1);
}

async function deleteUploadedImages(uploadedImages: UploadedImage[]) {
    if (uploadedImages.length === 0) return;

    const r2 = getR2Client();

    if (!r2) return;

    await Promise.allSettled(
        uploadedImages.map((image) =>
            r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: image.key })),
        ),
    );
}

async function deleteImageUrlsFromR2(urls: string[]) {
    const images = urls
        .map((url) => {
            const key = getR2KeyFromUrl(url);
            return key ? { key, url } : null;
        })
        .filter((image): image is UploadedImage => Boolean(image));

    await deleteUploadedImages(images);
}

export {
    parseProductBody,
    validateProductBody,
    uploadImagesToR2,
    deleteUploadedImages,
    deleteImageUrlsFromR2,
};
export type { FieldErrors, ParsedProductBody, ProductBody, UploadedImage };
