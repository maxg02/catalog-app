import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useDispatch, useSelector } from "react-redux";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import { setSelectedBusinessId } from "@/features/profile/businessSelectionSlice";
import { ProfileGate } from "@/app/_layout";

jest.mock("react-redux", () => ({ useDispatch: jest.fn(), useSelector: jest.fn(), useStore: jest.fn() }));
jest.mock("@/features/profile/api/profileApi", () => ({ useGetProfileQuery: jest.fn() }));
jest.mock("@/providers/reduxProvider", () => ({ __esModule: true, default: ({ children }: { children: React.ReactNode }) => children }));
jest.mock("@/providers/appThemeProvider", () => ({ AppThemeProvider: ({ children }: { children: React.ReactNode }) => children }));
jest.mock("@rn-primitives/portal", () => ({ PortalHost: () => null }));
jest.mock("expo-splash-screen", () => ({ preventAutoHideAsync: jest.fn(), hideAsync: jest.fn() }));
jest.mock("nativewind", () => ({ useColorScheme: () => ({ colorScheme: "light" }) }));
jest.mock("expo-status-bar", () => ({ StatusBar: () => null }));
jest.mock("@expo-google-fonts/plus-jakarta-sans", () => ({ useFonts: () => [true, null] }));

const query = useGetProfileQuery as jest.Mock;
const dispatch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    (useSelector as unknown as jest.Mock).mockReturnValue(null);
});

describe("profile gate", () => {
    it("renders loading and error states and retries", async () => {
        query.mockReturnValue({ isLoading: true, isError: false, isSuccess: false, refetch: jest.fn() });
        const view = await render(<ProfileGate />);
        expect(screen.getByText("Loading profile")).toBeTruthy();

        const refetch = jest.fn();
        query.mockReturnValue({ isLoading: false, isError: true, isSuccess: false, refetch });
        await view.rerender(<ProfileGate />);
        await fireEvent.press(screen.getByText("Retry"));
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("synchronizes the selected business and renders navigation", async () => {
        query.mockReturnValue({
            data: { businesses: [{ id: 8 }, { id: 9 }] },
            isLoading: false,
            isError: false,
            isSuccess: true,
            refetch: jest.fn(),
        });
        await render(<ProfileGate />);
        expect(dispatch).toHaveBeenCalledWith(setSelectedBusinessId(8));
    });
});
