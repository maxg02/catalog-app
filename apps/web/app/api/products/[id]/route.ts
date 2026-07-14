import { cookies } from "next/headers";
import { mapProductRowToDto } from "@/lib/mappers/productMapper";
import {
    deleteImageUrlsFromR2,
    deleteUploadedImages,
    parseProductBody,
    uploadImagesToR2,
    validateProductBody,
    type UploadedImage,
} from "@/lib/products/productRequest";
import { createClient } from "@/utils/supabase/server";
import type { ProductImageRow, ProductRow } from "@/interfaces";

const PRODUCTS_TABLE = "products";
const PRODUCT_IMAGES_TABLE = "product_images";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,description,sale,sale_price,sale_end_date,creation_date,business_id,details,on_stock,product_images(id,image_url,product_id,is_main)";

type ProductRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

function getProductImageRows(product: ProductRow) {
    return product.product_images ?? [];
}

export async function GET(_request: Request, { params }: ProductRouteContext) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
        return Response.json({ error: "Invalid product id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: product, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select(PRODUCT_SELECT)
        .eq("id", productId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching product:", error);

        return Response.json({ error: "Error fetching product" }, { status: 500 });
    }

    if (!product) {
        return Response.json({ error: "Product not found" }, { status: 404 });
    }

    return Response.json(mapProductRowToDto(product as ProductRow));
}

export async function PUT(request: Request, { params }: ProductRouteContext) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
        return Response.json({ error: "Invalid product id" }, { status: 400 });
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

    const result = validateProductBody(body, { allowExistingImages: true });

    if (!result.ok) {
        return Response.json(
            { error: "Please fix the highlighted fields.", fieldErrors: result.fieldErrors },
            { status: 400 },
        );
    }

    const productInput = result.product;
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: currentProduct, error: currentProductError } = await supabase
        .from(PRODUCTS_TABLE)
        .select(PRODUCT_SELECT)
        .eq("id", productId)
        .maybeSingle();

    if (currentProductError) {
        console.error("Error fetching product before update:", currentProductError);

        return Response.json({ error: "Error fetching product" }, { status: 500 });
    }

    if (!currentProduct) {
        return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const productRow = currentProduct as ProductRow;
    const currentImageRows = getProductImageRows(productRow) as ProductImageRow[];
    const currentImageUrls = currentImageRows.map((image) => image.image_url);
    const currentImageUrlSet = new Set(currentImageUrls);

    if (productInput.existingImages.some((url) => !currentImageUrlSet.has(url))) {
        return Response.json(
            {
                error: "Please fix the highlighted fields.",
                fieldErrors: { existingImages: "Existing image selection is invalid." },
            },
            { status: 400 },
        );
    }

    let uploadedImages: UploadedImage[] = [];

    try {
        uploadedImages = await uploadImagesToR2(productRow.business_id, productInput.images);
    } catch (error) {
        console.error("Error uploading product images to R2:", error);
        await deleteUploadedImages(uploadedImages);

        return Response.json({ error: "Unable to upload product images." }, { status: 502 });
    }

    const imageUrls = [...productInput.existingImages, ...uploadedImages.map((image) => image.url)];

    const { data: product, error: productError } = await supabase
        .from(PRODUCTS_TABLE)
        .update({
            name: productInput.name,
            price: productInput.price,
            description: productInput.description,
            details: productInput.details,
            is_public: productInput.isPublic,
            on_stock: productInput.onStock,
            is_featured: productInput.isFeatured,
            sale: productInput.sale,
            sale_price: productInput.salePrice,
            sale_end_date: productInput.saleEndDate,
        })
        .eq("id", productId)
        .select(PRODUCT_SELECT)
        .single();

    if (productError) {
        console.error("Error updating product:", productError);
        await deleteUploadedImages(uploadedImages);

        return Response.json({ error: "Error updating product" }, { status: 500 });
    }

    const { error: deleteImagesError } = await supabase
        .from(PRODUCT_IMAGES_TABLE)
        .delete()
        .eq("product_id", productId);

    if (deleteImagesError) {
        console.error("Error deleting product image rows:", deleteImagesError);
        await deleteUploadedImages(uploadedImages);

        return Response.json({ error: "Error updating product images" }, { status: 500 });
    }

    if (imageUrls.length > 0) {
        const productImageRows = imageUrls.map((imageUrl, index) => ({
            product_id: productId,
            image_url: imageUrl,
            is_main: index === productInput.mainImageIndex,
        }));
        const { error: insertImagesError } = await supabase
            .from(PRODUCT_IMAGES_TABLE)
            .insert(productImageRows);

        if (insertImagesError) {
            console.error("Error creating product image rows:", insertImagesError);
            await deleteUploadedImages(uploadedImages);

            return Response.json({ error: "Error updating product images" }, { status: 500 });
        }
    }

    const { data: updatedProduct, error: refetchError } = await supabase
        .from(PRODUCTS_TABLE)
        .select(PRODUCT_SELECT)
        .eq("id", productId)
        .single();

    if (refetchError) {
        console.error("Error fetching updated product:", refetchError);

        return Response.json(mapProductRowToDto(product as ProductRow));
    }

    const removedUrls = currentImageUrls.filter((url) => !imageUrls.includes(url));
    await deleteImageUrlsFromR2(removedUrls);

    return Response.json(mapProductRowToDto(updatedProduct as ProductRow));
}
export async function DELETE(_request: Request, { params }: ProductRouteContext) {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId) || productId < 1) {
        return Response.json({ error: "Invalid product id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: currentProduct, error: currentProductError } = await supabase
        .from(PRODUCTS_TABLE)
        .select(PRODUCT_SELECT)
        .eq("id", productId)
        .maybeSingle();

    if (currentProductError) {
        console.error("Error fetching product before delete:", currentProductError);

        return Response.json({ error: "Error fetching product" }, { status: 500 });
    }

    if (!currentProduct) {
        return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const imageUrls = getProductImageRows(currentProduct as ProductRow).map((image) => image.image_url);
    const { error: deleteProductError } = await supabase.from(PRODUCTS_TABLE).delete().eq("id", productId);

    if (deleteProductError) {
        console.error("Error deleting product:", deleteProductError);

        return Response.json({ error: "Error deleting product" }, { status: 500 });
    }

    await deleteImageUrlsFromR2(imageUrls);

    return new Response(null, { status: 204 });
}

