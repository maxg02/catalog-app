import { cookies } from "next/headers";
import { mapProductRowToCatalogDto, mapProductRowToDto } from "@/lib/mappers/productMapper";
import {
    deleteUploadedImages,
    parseProductBody,
    uploadImagesToR2,
    validateProductBody,
    type UploadedImage,
} from "@/lib/products/productRequest";
import { createClient } from "@/utils/supabase/server";
import type { ProductRow } from "@/interfaces";

const PRODUCTS_TABLE = "products";
const PRODUCT_IMAGES_TABLE = "product_images";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,description,sale,sale_price,sale_end_date,creation_date,business_id,details,on_stock,product_images(id,image_url,product_id,is_main)";
const CATALOG_PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,sale,sale_price,on_stock,creation_date,product_images(id,image_url,product_id,is_main)";

type BusinessProductsRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

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
        .select(CATALOG_PRODUCT_SELECT)
        .eq("business_id", businessId)
        .order("creation_date", { ascending: false });

    if (error) {
        console.error("Error fetching business products:", error);

        return Response.json({ error: "Error fetching business products" }, { status: 500 });
    }

    const productRows = (products ?? []) as ProductRow[];

    return Response.json(productRows.map((product) => mapProductRowToCatalogDto(product)));
}

export async function POST(request: Request, { params }: BusinessProductsRouteContext) {
    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId) || businessId < 1) {
        return Response.json({ error: "Invalid business id" }, { status: 400 });
    }

    let body;

    try {
        body = await parseProductBody(request);
    } catch {
        return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    if (!body) {
        return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const result = validateProductBody(body);

    if (!result.ok) {
        return Response.json(
            { error: "Please fix the highlighted fields.", fieldErrors: result.fieldErrors },
            { status: 400 },
        );
    }

    const productInput = result.product;
    let uploadedImages: UploadedImage[] = [];

    try {
        uploadedImages = await uploadImagesToR2(businessId, productInput.images);
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
            name: productInput.name,
            price: productInput.price,
            description: productInput.description,
            details: productInput.details,
            is_public: productInput.isPublic,
            on_stock: productInput.onStock,
            is_featured: productInput.isFeatured,
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
            is_main: index === productInput.mainImageIndex,
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

