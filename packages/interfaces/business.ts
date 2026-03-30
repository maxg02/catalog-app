import { BusinessCategories } from "enums";

export interface BusinessDto {
    name: string;
    category: BusinessCategories;
    location: string;
    rating: number;
    image: string;
    description: string;
}
