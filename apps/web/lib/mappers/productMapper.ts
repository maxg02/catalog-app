import type { ProductDto } from "@internal/interfaces";
import type { ProductImageRow, ProductRow } from "@/interfaces";

export function mapProductRowToDto(
    row: ProductRow,
    images: ProductImageRow[] = row.product_images ?? [],
): ProductDto {
    return {
        id: row.id,
        name: row.name,
        isPublic: row.is_public,
        price: row.price,
        image: images.map((image) => image.image_url),
        description: row.description,
        trending: false,
        bestSeller: false,
        sale: row.sale,
        salePrice: row.sale_price,
        saleEndDate: row.sale_end_date,
        onStock: row.on_stock,
        creationDate: new Date(row.creation_date),
        details: row.details ?? {},
        businessId: row.business_id,
    };
}
