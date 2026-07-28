import { BusinessCategories } from "@internal/enums";

function formatBusinessCategory(category: BusinessCategories | null) {
    return category == null ? "UNCATEGORIZED" : BusinessCategories[category].replace(/_/g, " ");
}

export { formatBusinessCategory };
