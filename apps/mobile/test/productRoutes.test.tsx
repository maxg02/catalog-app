import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSelector } from "react-redux";
import AddProduct from "@/app/catalog/add";
import EditProduct from "@/app/catalog/[id]";
import {
    useCreateBusinessProductMutation,
    useGetProductQuery,
    useUpdateBusinessProductMutation,
} from "@/features/catalog/api/catalogApi";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import type { ProductDto } from "@internal/interfaces";

const mockSubmitValues = { name: "P", price: 1, description: "D", details: {}, isPublic: true, onStock: true, isFeatured: false, sale: false, salePrice: null, saleEndDate: null, images: [], mainImageIndex: null };
let mockFormProps: { onSubmit: (value: typeof mockSubmitValues) => Promise<void> };

jest.mock("react-redux", () => ({ useSelector: jest.fn() }));
jest.mock("@/features/profile/api/profileApi", () => ({ useGetProfileQuery: jest.fn() }));
jest.mock("@/features/catalog/api/catalogApi", () => ({
    useCreateBusinessProductMutation: jest.fn(),
    useGetProductQuery: jest.fn(),
    useUpdateBusinessProductMutation: jest.fn(),
}));
jest.mock("@/features/catalog/components/productForm", () => ({
    __esModule: true,
    default: (props: typeof mockFormProps) => {
        const RN = jest.requireActual("react-native");
        mockFormProps = props;
        return <RN.Pressable onPress={() => void props.onSubmit(mockSubmitValues)}><RN.Text>Submit product route</RN.Text></RN.Pressable>;
    },
}));

const createHook = useCreateBusinessProductMutation as jest.Mock;
const updateHook = useUpdateBusinessProductMutation as jest.Mock;
const productHook = useGetProductQuery as jest.Mock;
const profileHook = useGetProfileQuery as jest.Mock;
const selector = useSelector as unknown as jest.Mock;
const params = useLocalSearchParams as jest.Mock;
const routerHook = useRouter as jest.Mock;
const router = { back: jest.fn(), push: jest.fn() };
const product = {
    id: 5, businessId: 3, name: "P", price: 1, description: "D", details: {}, image: [],
    onStock: true, isFeatured: false, isPublic: true, sale: false, salePrice: null, saleEndDate: null,
} as unknown as ProductDto;

function mutation() {
    const unwrap = jest.fn().mockResolvedValue({});
    return [jest.fn(() => ({ unwrap })), { isLoading: false }] as const;
}

beforeEach(() => {
    jest.clearAllMocks();
    routerHook.mockReturnValue(router);
    selector.mockReturnValue(3);
    params.mockReturnValue({ id: "5" });
    profileHook.mockReturnValue({ isLoading: false, isError: false });
    createHook.mockReturnValue(mutation());
    updateHook.mockReturnValue(mutation());
    productHook.mockReturnValue({ data: product, isLoading: false, isError: false, refetch: jest.fn() });
});

describe("product routes", () => {
    it("renders add loading/empty states and submits before navigating back", async () => {
        profileHook.mockReturnValue({ isLoading: true, isError: false });
        const view = await render(<AddProduct />);
        expect(screen.getByText("Loading business...")).toBeTruthy();
        profileHook.mockReturnValue({ isLoading: false, isError: true });
        await view.rerender(<AddProduct />);
        expect(screen.getByText("No business found")).toBeTruthy();
        profileHook.mockReturnValue({ isLoading: false, isError: false });
        await view.rerender(<AddProduct />);
        await fireEvent.press(screen.getByText("Submit product route"));
        expect(createHook.mock.results.at(-1)?.value[0]).toHaveBeenCalledWith({ businessId: 3, product: mockSubmitValues });
        expect(router.back).toHaveBeenCalled();
    });

    it("renders edit invalid/loading/error states and submits mapped identity", async () => {
        params.mockReturnValue({ id: "bad" });
        const view = await render(<EditProduct />);
        expect(screen.getByText("Product not found")).toBeTruthy();
        params.mockReturnValue({ id: "5" });
        productHook.mockReturnValue({ isLoading: true, isError: false, refetch: jest.fn() });
        await view.rerender(<EditProduct />);
        expect(screen.getByText("Loading product...")).toBeTruthy();
        productHook.mockReturnValue({ isLoading: false, isError: true, refetch: jest.fn() });
        await view.rerender(<EditProduct />);
        expect(screen.getByText("Tap to retry.")).toBeTruthy();
        productHook.mockReturnValue({ data: product, isLoading: false, isError: false, refetch: jest.fn() });
        await view.rerender(<EditProduct />);
        await fireEvent.press(screen.getByText("Submit product route"));
        expect(updateHook.mock.results.at(-1)?.value[0]).toHaveBeenCalledWith({ businessId: 3, productId: 5, product: mockSubmitValues });
        expect(router.back).toHaveBeenCalled();
    });
});
