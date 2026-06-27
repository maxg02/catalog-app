import { cookies } from "next/headers";
import { mapProductRowToDto } from "@/lib/mappers/productMapper";
import { createClient } from "@/utils/supabase/server";
import type { ProductRow } from "@/interfaces";

const PRODUCTS_TABLE = "products";
const PRODUCT_SELECT =
    "id,name,is_public,price,description,sale,sale_price,sale_end_date,creation_date,business_id,details,on_stock,product_images(id,image_url,product_id)";

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
