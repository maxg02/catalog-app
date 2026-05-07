import React, { useMemo } from "react";
import { BusinessCategories } from "enums";
import OptionSelector, { type OptionSelectorOption } from "@/components/ui/optionSelector";
import { formatBusinessCategory } from "@/features/profile/lib/formatBusinessCategory";

type BusinessCategorySelectorProps = {
    initialCategory: BusinessCategories;
};

function BusinessCategorySelector({ initialCategory }: BusinessCategorySelectorProps) {
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

    return <OptionSelector options={categoryOptions} initialValue={initialCategory} />;
}

export default BusinessCategorySelector;
export type { BusinessCategorySelectorProps };
