import { BusinessCategories } from "@internal/enums";
import { UserRole } from "./misc";
import type { ProductDto } from "./product";

export interface WeeklyMetrics {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
}

export interface BusinessInsightMetric {
    total: number;
    previousTotal: number;
    weekly: WeeklyMetrics;
}

export interface BusinessProductHighlight {
    label: string;
    metric: string;
    product: ProductDto;
}

export interface BusinessInsightsDto {
    overview: {
        catalogVisits: BusinessInsightMetric;
        ordersPlaced: BusinessInsightMetric;
        cartsCreated: BusinessInsightMetric;
    };
    productHighlights: BusinessProductHighlight[];
}

export interface BusinessLocationDto {
    address: string;
    city: string;
    country: string;
}

export interface UserDto {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface BusinessProfileDto {
    id: number;
    name: string;
    bannerImage: string | null;
    description: string | null;
    category: BusinessCategories | null;
    location: BusinessLocationDto | null;
    userId: number | null;
}

export interface ProfileDto {
    user: UserDto;
    businesses: BusinessProfileDto[];
}

export interface BusinessDto {
    id: number;
    name: string;
    category: BusinessCategories;
    location: BusinessLocationDto;
    rating: number;
    image: string;
    description: string;
}
