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

export interface UserBusinessDto {
    id: string;
    name: string;
    email: string;
    bannerImage: string;
    description: string;
    category: BusinessCategories;
    location: BusinessLocationDto | null;
    role: UserRole;
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
