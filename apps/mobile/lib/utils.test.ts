import { toRgb, toRgba } from "@/lib/utils";
import { formatBusinessCategory } from "@/features/profile/lib/formatBusinessCategory";
import { BusinessCategories } from "@internal/enums";

describe("mobile utilities", () => {
    test.each([
        ["255 0 12", "rgb(255, 0, 12)"],
        ["255,0,12", "rgb(255, 0, 12)"],
        [" 1,  2 3 ", "rgb(1, 2, 3)"],
    ])("converts %s to rgb", (input, expected) => expect(toRgb(input)).toBe(expected));

    expect(toRgba("1 2 3", 0.25)).toBe("rgba(1, 2, 3, 0.25)");

    test.each([
        [BusinessCategories.FOOD, "FOOD"],
        [BusinessCategories.BOOKSTORE, "BOOKSTORE"],
        [null, "UNCATEGORIZED"],
    ])("formats business category %s", (category, expected) => {
        expect(formatBusinessCategory(category)).toBe(expected);
    });
});
