import { BusinessDto } from "./business";

export interface ProductDto {
    id: number;
    name: string;
    isPublic: boolean;
    price: number;
    image: string[];
    description: string;
    isFeatured: boolean;
    bestSeller: boolean;
    sale: boolean;
    salePrice: number | null;
    saleEndDate: string | null;
    onStock: boolean;
    creationDate: Date;
    details: Record<string, string>;
    businessId: number;
}

export type CatalogProductDto = Pick<
    ProductDto,
    "id" | "name" | "isPublic" | "price" | "isFeatured" | "sale" | "salePrice" | "onStock"
> & {
    mainImage: string | null;
};

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
    cartTotal: number;
    saleTotal: number;
}

