import { cookies } from "next/headers";
import { mapProductRowToDto } from "@/lib/mappers/productMapper";
import { createClient } from "@/utils/supabase/server";
import type { ProductRow } from "@/interfaces";

const PRODUCTS_TABLE = "products";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,description,sale,sale_price,sale_end_date,creation_date,business_id,details,on_stock,product_images(id,image_url,product_id,is_main)";

type ProductRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

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

