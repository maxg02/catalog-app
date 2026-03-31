import { BusinessCategories } from "enums";

export interface BusinessDto {
    id: number;
    name: string;
    category: BusinessCategories;
    location: string;
    rating: number;
    image: string;
    description: string;
}
