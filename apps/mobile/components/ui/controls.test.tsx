import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimeInput from "./dateTimeInput";
import OptionSelector from "./optionSelector";
import SearchableSelect from "./searchableSelect";

jest.mock("lucide-nativewind", () => ({
    CalendarIcon: () => null,
    CheckIcon: () => null,
    ChevronDownIcon: () => null,
    ChevronUpIcon: () => null,
    SearchIcon: () => null,
}));

describe("selection and date controls", () => {
    it("filters and selects an uncontrolled searchable option", async () => {
        const onValueChange = jest.fn();
        await render(
            <SearchableSelect
                options={[{ label: "Apple", value: "a" }, { label: "Banana", value: "b" }]}
                placeholder="Choose fruit"
                searchPlaceholder="Find fruit"
                onValueChange={onValueChange}
            />,
        );
        await fireEvent.press(screen.getByText("Choose fruit"));
        await fireEvent.changeText(screen.getByPlaceholderText("Find fruit"), "ban");
        expect(screen.queryByText("Apple")).toBeNull();
        await fireEvent.press(screen.getByText("Banana"));
        expect(onValueChange).toHaveBeenCalledWith("b");
        expect(screen.getByText("Banana")).toBeTruthy();
    });

    it("supports controlled and uncontrolled option selection", async () => {
        const onValueChange = jest.fn();
        const options = [{ label: "One", value: 1 }, { label: "Two", value: 2 }];
        const view = await render(<OptionSelector options={options} onValueChange={onValueChange} />);
        await fireEvent.press(screen.getByText("Two"));
        expect(onValueChange).toHaveBeenCalledWith(2);
        expect(screen.getAllByRole("radio")[1].props.accessibilityState.checked).toBe(true);

        await view.rerender(<OptionSelector options={options} value={1} onValueChange={onValueChange} />);
        await fireEvent.press(screen.getByText("Two"));
        expect(screen.getAllByRole("radio")[0].props.accessibilityState.checked).toBe(true);
    });

    it("accepts set dates, ignores cancellation, and respects a controlled value", async () => {
        const onDateChange = jest.fn();
        const value = new Date("2026-08-01T12:00:00.000Z");
        const next = new Date("2026-08-02T12:00:00.000Z");
        await render(<DateTimeInput mode="date" value={value} onDateChange={onDateChange} />);
        await fireEvent.press(screen.getByText(value.toLocaleString()));
        const open = DateTimePickerAndroid.open as jest.Mock;
        const options = open.mock.calls[0][0];
        options.onChange({ type: "dismissed" }, next);
        expect(onDateChange).not.toHaveBeenCalled();
        options.onChange({ type: "set" }, next);
        expect(onDateChange).toHaveBeenCalledWith(next);
        expect(screen.getByText(value.toLocaleString())).toBeTruthy();
    });
});
