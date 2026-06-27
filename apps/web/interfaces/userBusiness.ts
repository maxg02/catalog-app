import type { BusinessLocationDto, UserRole } from "@internal/interfaces";

export interface UserBusinessRow {
    id: number;
    name: string;
    email: string;
    banner_image: string;
    description: string;
    category: number;
    location: BusinessLocationDto | null;
    user_role: UserRole;
}
