export interface ProductRow {
    id: number;
    name: string;
    is_public: boolean;
    price: number;
    description: string;
    sale: boolean;
    sale_price: number | null;
    sale_end_date: string | null;
    creation_date: string;
    business_id: number;
    details: Record<string, string> | null;
    on_stock: boolean;
    product_images?: ProductImageRow[] | null;
    is_featured: boolean;
}

export interface ProductImageRow {
    id: number;
    image_url: string;
    product_id: number;
    is_main: boolean;
}
