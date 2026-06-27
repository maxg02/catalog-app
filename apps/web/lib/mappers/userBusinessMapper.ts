import { BusinessCategories } from "@internal/enums";
import type { UserBusinessDto } from "@internal/interfaces";
import type { UserBusinessRow } from "@/interfaces";

function mapBusinessCategory(category: UserBusinessRow["category"]): UserBusinessDto["category"] {
    const zeroBasedCategory = category - 1;

    if (BusinessCategories[zeroBasedCategory]) {
        return zeroBasedCategory;
    }

    return category as UserBusinessDto["category"];
}

export function mapUserBusinessRowToDto(row: UserBusinessRow): UserBusinessDto {
    return {
        id: String(row.id),
        name: row.name,
        email: row.email,
        bannerImage: row.banner_image,
        description: row.description,
        category: mapBusinessCategory(row.category),
        location: row.location,
        role: row.user_role,
    };
}
