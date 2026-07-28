import { BusinessCategories } from "@internal/enums";
import type { BusinessProfileDto, UserDto } from "@internal/interfaces";
import type { BusinessProfileRow, UserRow } from "@/interfaces";
import { getBusinessImageUrls } from "@/lib/business/businessImages";

function mapBusinessCategory(category: BusinessProfileRow["category"]): BusinessProfileDto["category"] {
    if (category == null) return null;

    const zeroBasedCategory = category - 1;

    if (BusinessCategories[zeroBasedCategory]) {
        return zeroBasedCategory;
    }

    return category as BusinessProfileDto["category"];
}

export function mapUserRowToDto(row: UserRow): UserDto {
    return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
    };
}

export function mapBusinessProfileRowToDto(row: BusinessProfileRow): BusinessProfileDto {
    return {
        id: row.id,
        name: row.name,
        bannerImage: getBusinessImageUrls(row.business_images)[0] ?? null,
        description: row.description,
        category: mapBusinessCategory(row.category),
        location: row.location,
        userId: row.user_id,
    };
}


