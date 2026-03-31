export interface ProductDto {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    trending: boolean;
    BestSeller: boolean;
    Sale: boolean;
    SalePrice: number | null;
    Stock: number;
}
