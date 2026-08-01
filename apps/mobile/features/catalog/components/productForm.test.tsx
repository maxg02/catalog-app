import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import ProductForm from "./productForm";
import type { ProductFormValues } from "@/features/catalog/lib/productLogic";

jest.mock("lucide-nativewind", () => new Proxy({}, { get: () => () => null }));
jest.mock("./productMediaUpload", () => ({ __esModule: true, default: () => null }));

const defaults: ProductFormValues = {
    name: "",
    price: "",
    description: "",
    details: [],
    onStock: true,
    isFeatured: false,
    visibility: "public",
    sale: false,
    salePrice: "",
    saleEndDate: null,
};

async function fillRequiredFields() {
    await fireEvent.changeText(screen.getByPlaceholderText("e.g. Handmade Ceramic Vase"), "  Vase  ");
    await fireEvent.changeText(screen.getByPlaceholderText("0.00"), "12,50");
    await fireEvent.changeText(screen.getByPlaceholderText("Tell customers more about this item..."), "  Handmade  ");
}

describe("product form", () => {
    it("shows validation, normalizes submission, and exposes loading state", async () => {
        const onSubmit = jest.fn().mockResolvedValue(undefined);
        const view = await render(
            <ProductForm defaultValues={defaults} submitLabel="Save Product" loadingLabel="Saving product..." onSubmit={onSubmit} />,
        );
        await fireEvent.press(screen.getByText("Save Product"));
        expect(await screen.findByText("Product name is required.")).toBeTruthy();
        expect(screen.getByText("Price is required.")).toBeTruthy();
        expect(screen.getByText("Description is required.")).toBeTruthy();

        await fillRequiredFields();
        await fireEvent.press(screen.getByText("Save Product"));
        await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
            name: "Vase",
            price: 12.5,
            description: "Handmade",
            isPublic: true,
            sale: false,
            salePrice: null,
        })));

        await view.rerender(
            <ProductForm defaultValues={defaults} submitLabel="Save Product" loadingLabel="Saving product..." isSaving onSubmit={onSubmit} />,
        );
        expect(screen.getAllByText("Saving product...")).toHaveLength(2);
    });

    it("maps server field and general errors", async () => {
        const onSubmit = jest.fn().mockRejectedValue({
            data: { error: "Unable to save", fieldErrors: { name: "Name is already used." } },
        });
        await render(
            <ProductForm defaultValues={defaults} submitLabel="Save Product" loadingLabel="Saving product..." onSubmit={onSubmit} />,
        );
        await fillRequiredFields();
        await fireEvent.press(screen.getByText("Save Product"));
        expect(await screen.findByText("Name is already used.")).toBeTruthy();
        expect(screen.getByText("Unable to save")).toBeTruthy();
    });
});
