import type { BusinessLocationDto, UserRole } from "@internal/interfaces";

export interface UserRow {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

export interface BusinessProfileRow {
    id: number;
    name: string;
    description: string | null;
    category: number | null;
    location: BusinessLocationDto | null;
    user_id: number | null;
    business_images?: { image_url: string } | { image_url: string }[] | null;
}
