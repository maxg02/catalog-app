import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { BusinessCategories } from "@internal/enums";
import BusinessForm from "./businessForm";
import { useGetCountriesQuery, useGetStatesQuery } from "@/features/profile/api/profileApi";
import type { BusinessFormValues } from "@/features/profile/lib/formLogic";

jest.mock("lucide-nativewind", () => new Proxy({}, { get: () => () => null }));
jest.mock("./businessBannerUpload", () => ({ __esModule: true, default: () => null }));
jest.mock("./businessCategorySelector", () => ({ __esModule: true, default: () => null }));
jest.mock("@/features/profile/api/profileApi", () => ({
    useGetCountriesQuery: jest.fn(),
    useGetStatesQuery: jest.fn(),
}));

const countries = useGetCountriesQuery as jest.Mock;
const states = useGetStatesQuery as jest.Mock;
const defaults: BusinessFormValues = {
    name: " Shop ",
    category: BusinessCategories.FOOD,
    description: "  ",
    address: " 1 Main ",
    city: "Distrito Nacional",
    country: "Dominican Republic",
};

beforeEach(() => {
    countries.mockReturnValue({ data: [{ id: "DO", name: "Dominican Republic", flagUrl: "flag" }], isLoading: false, isError: false });
    states.mockReturnValue({ data: [{ stateCode: "01", countryCode: "DO", name: "Distrito Nacional" }], isLoading: false, isError: false });
});

describe("business form", () => {
    it("validates, normalizes submission, and exposes loading", async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        const view = await render(<BusinessForm defaultValues={{ ...defaults, name: "" }} submitLabel="Save Business" loadingLabel="Saving business..." onSubmit={onSubmit} />);
        await fireEvent.press(screen.getByText("Save Business"));
        expect(await screen.findByText("Business name is required.")).toBeTruthy();
        await fireEvent.changeText(screen.getByPlaceholderText("Business name"), " Shop ");
        await fireEvent.press(screen.getByText("Save Business"));
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({
            name: "Shop",
            bannerImage: null,
            description: null,
            category: BusinessCategories.FOOD,
            location: { address: "1 Main", city: "Distrito Nacional", country: "Dominican Republic" },
        }));
        await view.rerender(<BusinessForm defaultValues={defaults} submitLabel="Save Business" loadingLabel="Saving business..." isSaving onSubmit={onSubmit} />);
        expect(screen.getAllByText("Saving business...")).toHaveLength(2);
    });

    it("maps server field and location errors", async () => {
        const onSubmit = jest.fn().mockRejectedValue({ data: { fieldErrors: { name: "Taken", location: "Invalid location" } } });
        await render(<BusinessForm defaultValues={defaults} submitLabel="Save Business" loadingLabel="Saving business..." onSubmit={onSubmit} />);
        await fireEvent.press(screen.getByText("Save Business"));
        expect(await screen.findByText("Taken")).toBeTruthy();
        expect(screen.getByText("Invalid location")).toBeTruthy();
    });
});
