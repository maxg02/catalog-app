import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { BusinessProfileRow, ProductRow } from "@/interfaces";
import { mapProductRowToCatalogDto } from "@/lib/mappers/productMapper";
import { mapBusinessProfileRowToDto } from "@/lib/mappers/userBusinessMapper";
import { createClient } from "@/utils/supabase/server";

const BUSINESS_SELECT = "id,name,description,category,location,user_id,business_images(image_url)";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,sale,sale_price,on_stock,creation_date,product_images(id,image_url,product_id,is_main)";

export default async function CatalogPage({ params }: { params: Promise<{ id: string }> }) {
    const businessId = Number((await params).id);
    if (!Number.isInteger(businessId) || businessId < 1) notFound();

    const supabase = createClient(await cookies());
    const [businessResult, productsResult] = await Promise.all([
        supabase.from("businesses").select(BUSINESS_SELECT).eq("id", businessId).maybeSingle(),
        supabase
            .from("products")
            .select(PRODUCT_SELECT)
            .eq("business_id", businessId)
            .eq("is_public", true)
            .order("creation_date", { ascending: false }),
    ]);

    if (businessResult.error || productsResult.error) {
        throw new Error("Unable to load catalog");
    }
    if (!businessResult.data) notFound();

    const business = mapBusinessProfileRowToDto(businessResult.data as BusinessProfileRow);
    const products = ((productsResult.data ?? []) as ProductRow[]).map((product) =>
        mapProductRowToCatalogDto(product),
    );

    return (
        <main>
            <h1>{business.name}</h1>
            {business.bannerImage ? (
                // The banner host is user-configured, so avoid a fixed Next Image allowlist.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={business.bannerImage} alt={`${business.name} banner`} />
            ) : (
                <p>No business banner.</p>
            )}

            <h2>Products</h2>
            {products.length ? (
                <ul>
                    {products.map((product) => (
                        <li key={product.id}>
                            {product.name} — ${product.salePrice ?? product.price}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No products available.</p>
            )}
        </main>
    );
}
