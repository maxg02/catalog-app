import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "nativewind";
import Catalog from "@/app/(home)/index";
import Insights from "@/app/(home)/insights";
import Profile from "@/app/(home)/profile";
import Settings from "@/app/profile/settings";
import { useDeleteBusinessProductMutation, useGetBusinessProductsQuery } from "@/features/catalog/api/catalogApi";
import { useGetBusinessInsightsQuery } from "@/features/insights/api/insightsApi";
import { useGetProfileQueryState } from "@/features/profile/api/profileApi";
import { setSelectedBusinessId } from "@/features/profile/businessSelectionSlice";
import { useScrollAmount } from "@/contexts/scrollAmountContext";

jest.mock("lucide-nativewind", () => new Proxy({}, { get: () => () => null }));
jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn() }));
jest.mock("nativewind", () => ({ useColorScheme: jest.fn() }));
jest.mock("@/contexts/scrollAmountContext", () => ({ useScrollAmount: jest.fn(() => null) }));
jest.mock("@/features/catalog/api/catalogApi", () => ({ useDeleteBusinessProductMutation: jest.fn(), useGetBusinessProductsQuery: jest.fn() }));
jest.mock("@/features/insights/api/insightsApi", () => ({ useGetBusinessInsightsQuery: jest.fn() }));
jest.mock("@/features/profile/api/profileApi", () => ({ useGetProfileQueryState: jest.fn() }));
jest.mock("@/features/catalog/components/catalogProductCard", () => ({ __esModule: true, default: ({ name }: { name: string }) => { const RN = jest.requireActual("react-native"); return <RN.Text>{name}</RN.Text>; } }));
jest.mock("@/features/insights/components/overviewCards", () => ({ __esModule: true, default: () => { const RN = jest.requireActual("react-native"); return <RN.Text>Overview data</RN.Text>; } }));
jest.mock("@/features/insights/components/productHighlight", () => ({ __esModule: true, default: () => { const RN = jest.requireActual("react-native"); return <RN.Text>Highlight data</RN.Text>; } }));
jest.mock("@/features/insights/components/weeklyPerformanceCarousel", () => ({ __esModule: true, default: () => { const RN = jest.requireActual("react-native"); return <RN.Text>Weekly data</RN.Text>; } }));
jest.mock("@/features/profile/components/businessProfileDetails", () => ({ __esModule: true, default: () => null }));
jest.mock("@/components/ui/searchableSelect", () => ({
    __esModule: true,
    default: ({ onValueChange }: { onValueChange: (value: string) => void }) => { const RN = jest.requireActual("react-native"); return <RN.Pressable onPress={() => onValueChange("2")}><RN.Text>Switch business</RN.Text></RN.Pressable>; },
}));
jest.mock("@/components/ui/optionSelector", () => ({
    __esModule: true,
    default: ({ onValueChange }: { onValueChange: (value: string) => void }) => { const RN = jest.requireActual("react-native"); return <RN.Pressable onPress={() => onValueChange("dark")}><RN.Text>Dark theme</RN.Text></RN.Pressable>; },
}));

const selector = useSelector as unknown as jest.Mock;
const dispatch = jest.fn();
const profileState = useGetProfileQueryState as jest.Mock;
const products = useGetBusinessProductsQuery as jest.Mock;
const insights = useGetBusinessInsightsQuery as jest.Mock;
const deleteProduct = useDeleteBusinessProductMutation as jest.Mock;
const colorScheme = useColorScheme as jest.Mock;
const scrollHook = useScrollAmount as jest.Mock;

beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    selector.mockReturnValue(1);
    profileState.mockReturnValue({ data: { user: { name: "Ada", email: "a@b.co" }, businesses: [{ id: 1, name: "One", bannerImage: null }] }, isLoading: false, isError: false });
    products.mockReturnValue({ data: [], isLoading: false, isFetching: false, isError: false, refetch: jest.fn() });
    insights.mockReturnValue({ isLoading: false, isFetching: false, isError: false, refetch: jest.fn() });
    deleteProduct.mockReturnValue([jest.fn(), { isLoading: false }]);
    colorScheme.mockReturnValue({ colorScheme: "light", setColorScheme: jest.fn() });
});

describe("home and settings routes", () => {
    it("renders catalog states and filters public/draft products", async () => {
        products.mockReturnValue({ data: [], isLoading: true, isFetching: false, isError: false, refetch: jest.fn() });
        const view = await render(<Catalog />);
        expect(scrollHook).toHaveBeenCalledWith("index");
        expect(screen.getByText("Loading products...")).toBeTruthy();
        products.mockReturnValue({ data: [], isLoading: false, isFetching: false, isError: true, refetch: jest.fn() });
        await view.rerender(<Catalog />);
        expect(screen.getByText("Unable to load products from the API.")).toBeTruthy();
        products.mockReturnValue({ data: [{ id: 1, name: "Public item", isPublic: true }, { id: 2, name: "Draft item", isPublic: false }], isLoading: false, isFetching: false, isError: false, refetch: jest.fn() });
        await view.rerender(<Catalog />);
        await fireEvent.press(screen.getByText("Draft"));
        expect(screen.getByText("Draft item")).toBeTruthy();
        expect(screen.queryByText("Public item")).toBeNull();
    });

    it("renders insights empty/error/data states", async () => {
        selector.mockReturnValue(null);
        profileState.mockReturnValue({ data: { businesses: [] }, isLoading: false, isError: false });
        const view = await render(<Insights />);
        expect(screen.getByText("Add a business to see insights.")).toBeTruthy();
        selector.mockReturnValue(1);
        profileState.mockReturnValue({ data: { businesses: [{ id: 1, name: "One" }] }, isLoading: false, isError: false });
        insights.mockReturnValue({ isLoading: false, isFetching: false, isError: true, refetch: jest.fn() });
        await view.rerender(<Insights />);
        expect(screen.getByText("Unable to load insights from the API.")).toBeTruthy();
        insights.mockReturnValue({ data: { overview: { ordersPlaced: { weekly: {} }, catalogVisits: { weekly: {} }, cartsCreated: { weekly: {} } }, productHighlights: [] }, isLoading: false, isFetching: false, isError: false, refetch: jest.fn() });
        await view.rerender(<Insights />);
        expect(screen.getByText("Overview data")).toBeTruthy();
        expect(screen.getByText("Weekly data")).toBeTruthy();
    });

    it("switches businesses and changes theme", async () => {
        const profileView = await render(<Profile />);
        await fireEvent.press(screen.getByText("Switch business"));
        expect(dispatch).toHaveBeenCalledWith(setSelectedBusinessId(2));
        await profileView.unmount();

        const setColorScheme = jest.fn();
        colorScheme.mockReturnValue({ colorScheme: "light", setColorScheme });
        await render(<Settings />);
        await fireEvent.press(screen.getByText("Dark theme"));
        expect(setColorScheme).toHaveBeenCalledWith("dark");
    });
});
