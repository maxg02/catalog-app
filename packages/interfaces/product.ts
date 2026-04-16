export interface ProductDto {
    id: number;
    name: string;
    price: number;
    image: string[];
    description: string;
    trending: boolean;
    bestSeller: boolean;
    sale: boolean;
    salePrice: number | null;
    stock: number;
    creationDate: Date;
    details: Record<string, string>;
    businessId: number;
}

export interface SavedProductListDto {
    businessId: number;
    businessName: string;
    productData: ProductDto[];
}
