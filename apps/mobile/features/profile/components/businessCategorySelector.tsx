import React, { useMemo } from "react";
import { BusinessCategories } from "@internal/enums";
import OptionSelector, { type OptionSelectorOption } from "@/components/ui/optionSelector";
import { formatBusinessCategory } from "@/features/profile/lib/formatBusinessCategory";

type BusinessCategorySelectorProps = {
    initialCategory?: BusinessCategories | null;
    value?: BusinessCategories | null;
    onValueChange?: (category: BusinessCategories) => void;
};

function BusinessCategorySelector({
    initialCategory,
    value,
    onValueChange,
}: BusinessCategorySelectorProps) {
    const categoryOptions = useMemo(
        () =>
            Object.values(BusinessCategories)
                .filter((category) => typeof category === "number")
                .map((category) => ({
                    label: formatBusinessCategory(category),
                    value: category,
                })) as OptionSelectorOption<BusinessCategories>[],
        [],
    );

    return (
        <OptionSelector
            options={categoryOptions}
            initialValue={initialCategory ?? BusinessCategories.FOOD}
            value={value ?? undefined}
            onValueChange={onValueChange}
        />
    );
}

export default BusinessCategorySelector;
export type { BusinessCategorySelectorProps };
