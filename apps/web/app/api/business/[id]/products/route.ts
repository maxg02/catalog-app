import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { mapProductRowToDto } from "@/lib/mappers/productMapper";
import { createClient } from "@/utils/supabase/server";
import type { ProductRow } from "@/interfaces";

const PRODUCTS_TABLE = "products";
const PRODUCT_IMAGES_TABLE = "product_images";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,description,sale,sale_price,sale_end_date,creation_date,business_id,details,on_stock,product_images(id,image_url,product_id,is_main)";
const MAX_DETAILS = 10;
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type BusinessProductsRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

type CreateProductBody = {
    name?: unknown;
    price?: unknown;
    description?: unknown;
    details?: unknown;
    isPublic?: unknown;
    onStock?: unknown;
    isFeatured?: unknown;
    mainImageIndex?: unknown;
    images?: File[];
};

type UploadedImage = {
    key: string;
    url: string;
};

type FieldErrors = Partial<Record<keyof CreateProductBody, string>>;

let r2Client: S3Client | null = null;

export async function GET(_request: Request, { params }: BusinessProductsRouteContext) {
    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId) || businessId < 1) {
        return Response.json({ error: "Invalid business id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: products, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select(PRODUCT_SELECT)
        .eq("business_id", businessId)
        .order("creation_date", { ascending: false });

    if (error) {
        console.error("Error fetching business products:", error);

        return Response.json({ error: "Error fetching business products" }, { status: 500 });
    }

    const productRows = (products ?? []) as ProductRow[];

    return Response.json(productRows.map((product) => mapProductRowToDto(product)));
}

function parseDetails(value: unknown, fieldErrors: FieldErrors) {
    if (value === undefined || value === null || value === "") {
        return {};
    }

    let detailsValue: unknown = value;

    if (typeof value === "string") {
        try {
            detailsValue = JSON.parse(value) as unknown;
        } catch {
            fieldErrors.details = "Details must be a record.";
            return {};
        }
    }

    if (typeof detailsValue !== "object" || Array.isArray(detailsValue)) {
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

async function parseCreateProductBody(request: Request): Promise<CreateProductBody | null> {
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
            mainImageIndex: formData.get("mainImageIndex"),
            images,
        };
    }

    const json = await request.json();

    return json && typeof json === "object" && !Array.isArray(json) ? (json as CreateProductBody) : null;
}

function parseBoolean(value: unknown) {
    if (typeof value === "boolean") {
        return value;
    }

    if (value === "true") {
        return true;
    }

    if (value === "false") {
        return false;
    }

    return null;
}

function getR2Config() {
    const accountId = process.env.NEXT_R2_ACCOUNT_ID;
    const accessKeyId = process.env.NEXT_R2_ACCESS_KEY;
    const secretAccessKey = process.env.NEXT_R2_SECRET_ACCESS_KEY;
    const bucket = process.env.NEXT_R2_BUCKET_NAME;
    const publicBaseUrl = process.env.NEXT_R2_PUBLIC_BASE_URL;

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBaseUrl) {
        return null;
    }

    return { accountId, accessKeyId, secretAccessKey, bucket, publicBaseUrl };
}

function getR2Client() {
    const config = getR2Config();

    if (!config) {
        return null;
    }

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

    if (fileNameExtension && /^[a-z0-9]+$/.test(fileNameExtension)) {
        return fileNameExtension;
    }

    return file.type.split("/")[1] || "jpg";
}

async function uploadImagesToR2(businessId: number, images: File[]) {
    if (images.length === 0) {
        return [];
    }

    const r2 = getR2Client();

    if (!r2) {
        throw new Error("R2 is not configured.");
    }

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

async function deleteUploadedImages(uploadedImages: UploadedImage[]) {
    if (uploadedImages.length === 0) {
        return;
    }

    const r2 = getR2Client();

    if (!r2) {
        return;
    }

    await Promise.allSettled(
        uploadedImages.map((image) =>
            r2.client.send(new DeleteObjectCommand({ Bucket: r2.bucket, Key: image.key })),
        ),
    );
}

export async function POST(request: Request, { params }: BusinessProductsRouteContext) {
    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId) || businessId < 1) {
        return Response.json({ error: "Invalid business id" }, { status: 400 });
    }

    let body: CreateProductBody | null;

    try {
        body = await parseCreateProductBody(request);
    } catch {
        return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!body) {
        return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const fieldErrors: FieldErrors = {};
    const images = body.images ?? [];
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const description = typeof body.description === "string" ? body.description.trim() : "";
    const rawPrice = typeof body.price === "string" ? body.price.trim() : body.price;
    const price =
        typeof rawPrice === "number"
            ? rawPrice
            : typeof rawPrice === "string" && rawPrice
              ? Number(rawPrice)
              : NaN;
    const details = parseDetails(body.details, fieldErrors);
    const isPublic = parseBoolean(body.isPublic);
    const onStock = parseBoolean(body.onStock);
    const isFeatured = parseBoolean(body.isFeatured);
    const rawMainImageIndex =
        typeof body.mainImageIndex === "string" && body.mainImageIndex.trim()
            ? Number(body.mainImageIndex)
            : typeof body.mainImageIndex === "number"
              ? body.mainImageIndex
              : 0;

    if (!name) {
        fieldErrors.name = "Product name is required.";
    }

    if (rawPrice === undefined || rawPrice === null || rawPrice === "") {
        fieldErrors.price = "Price is required.";
    } else if (!Number.isFinite(price) || price <= 0) {
        fieldErrors.price = "Price must be greater than 0.";
    }

    if (!description) {
        fieldErrors.description = "Description is required.";
    }

    if (isPublic === null) {
        fieldErrors.isPublic = "Visibility is required.";
    }

    if (onStock === null) {
        fieldErrors.onStock = "Stock status is required.";
    }

    if (isFeatured === null) {
        fieldErrors.isFeatured = "Featured status is required.";
    }

    if (images.length > MAX_IMAGES) {
        fieldErrors.images = `Products can have up to ${MAX_IMAGES} images.`;
    }

    if (images.some((image) => !IMAGE_TYPES.has(image.type))) {
        fieldErrors.images = "Images must be JPEG, PNG, WebP, or GIF files.";
    }

    if (images.some((image) => image.size > MAX_IMAGE_SIZE)) {
        fieldErrors.images = "Each image must be 5MB or smaller.";
    }

    if (
        images.length > 0 &&
        (!Number.isInteger(rawMainImageIndex) ||
            rawMainImageIndex < 0 ||
            rawMainImageIndex >= images.length)
    ) {
        fieldErrors.mainImageIndex = "Main image selection is invalid.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return Response.json(
            { error: "Please fix the highlighted fields.", fieldErrors },
            { status: 400 },
        );
    }

    let uploadedImages: UploadedImage[] = [];

    try {
        uploadedImages = await uploadImagesToR2(businessId, images);
    } catch (error) {
        console.error("Error uploading product images to R2:", error);
        await deleteUploadedImages(uploadedImages);

        return Response.json({ error: "Unable to upload product images." }, { status: 502 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: product, error: productError } = await supabase
        .from(PRODUCTS_TABLE)
        .insert({
            name,
            price,
            description,
            details,
            is_public: isPublic === true,
            on_stock: onStock === true,
            is_featured: isFeatured === true,
            business_id: businessId,
            sale: false,
            sale_price: null,
            sale_end_date: null,
        })
        .select(PRODUCT_SELECT)
        .single();

    if (productError) {
        console.error("Error creating business product:", productError);
        await deleteUploadedImages(uploadedImages);

        return Response.json({ error: "Error creating business product" }, { status: 500 });
    }

    if (uploadedImages.length > 0) {
        const productImageRows = uploadedImages.map((image, index) => ({
            product_id: product.id,
            image_url: image.url,
            is_main: index === rawMainImageIndex,
        }));
        const { error: imagesError } = await supabase.from(PRODUCT_IMAGES_TABLE).insert(productImageRows);

        if (imagesError) {
            console.error("Error creating product image rows:", imagesError);
            await supabase.from(PRODUCTS_TABLE).delete().eq("id", product.id);
            await deleteUploadedImages(uploadedImages);

            return Response.json({ error: "Error creating product images" }, { status: 500 });
        }
    }

    const { data: createdProduct, error: refetchError } = await supabase
        .from(PRODUCTS_TABLE)
        .select(PRODUCT_SELECT)
        .eq("id", product.id)
        .single();

    if (refetchError) {
        console.error("Error fetching created business product:", refetchError);

        return Response.json(mapProductRowToDto(product as ProductRow), { status: 201 });
    }

    return Response.json(mapProductRowToDto(createdProduct as ProductRow), { status: 201 });
}
