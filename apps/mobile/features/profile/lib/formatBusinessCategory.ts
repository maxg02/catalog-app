import { BusinessCategories } from "@internal/enums";

function formatBusinessCategory(category: BusinessCategories) {
    return BusinessCategories[category].replace(/_/g, " ");
}

export { formatBusinessCategory };
