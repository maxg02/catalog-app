import { BusinessCategories } from "enums";
import { UserRole } from "./misc";

interface WeeklyMetrics {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
}

export interface UserBusinessDto {
    id: string;
    name: string;
    email: string;
    rol: UserRole;
    profileVisits: WeeklyMetrics;
    catalogVisits: WeeklyMetrics;
    productViews: WeeklyMetrics;
    inquiries: WeeklyMetrics;
}

export interface BusinessDto {
    id: number;
    name: string;
    category: BusinessCategories;
    location: string;
    rating: number;
    image: string;
    description: string;
}
