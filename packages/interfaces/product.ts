import { BusinessDto } from "./business";

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
    id: number;
    businessId: number;
    businessName: string;
    productData: ProductDto[];
}

export interface CartProductDto extends ProductDto {
    quantity: number;
}

export interface CartDto {
    id: number;
    businessData: BusinessDto;
    productData: CartProductDto[];
}
