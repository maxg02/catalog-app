import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AddBusiness from "@/app/profile/business/add";
import EditBusiness from "@/app/profile/business/[id]";
import EditBusinessAccount from "@/app/profile/edit";
import {
    useCreateBusinessMutation,
    useGetBusinessQuery,
    useGetProfileQuery,
    useUpdateBusinessMutation,
} from "@/features/profile/api/profileApi";
import type { BusinessMutationPayload } from "@/features/profile/api/profileApi";

const mockPayload: BusinessMutationPayload = { name: "Shop", bannerImage: null, description: null, category: null, location: null };
let mockBusinessFormProps: { onSubmit: (value: BusinessMutationPayload) => Promise<void> };

jest.mock("@/features/profile/api/profileApi", () => ({
    useCreateBusinessMutation: jest.fn(),
    useGetBusinessQuery: jest.fn(),
    useGetProfileQuery: jest.fn(),
    useUpdateBusinessMutation: jest.fn(),
}));
jest.mock("@/features/profile/components/businessForm", () => ({
    __esModule: true,
    emptyBusinessValues: { name: "", category: 0, description: "", address: "", city: "", country: "" },
    getBusinessFormValues: (business: { name: string }) => ({ name: business.name }),
    default: (props: typeof mockBusinessFormProps) => {
        const RN = jest.requireActual("react-native");
        mockBusinessFormProps = props;
        return <RN.Pressable onPress={() => void props.onSubmit(mockPayload)}><RN.Text>Submit business route</RN.Text></RN.Pressable>;
    },
}));
jest.mock("@/features/profile/components/editBusinessAccountForm", () => ({
    __esModule: true,
    default: () => { const RN = jest.requireActual("react-native"); return <RN.Text>Managed profile</RN.Text>; },
}));

const createHook = useCreateBusinessMutation as jest.Mock;
const businessHook = useGetBusinessQuery as jest.Mock;
const profileHook = useGetProfileQuery as jest.Mock;
const updateHook = useUpdateBusinessMutation as jest.Mock;
const params = useLocalSearchParams as jest.Mock;
const routerHook = useRouter as jest.Mock;
const router = { back: jest.fn(), push: jest.fn() };

function mutation() {
    const unwrap = jest.fn().mockResolvedValue({});
    return [jest.fn(() => ({ unwrap })), { isLoading: false }] as const;
}

beforeEach(() => {
    jest.clearAllMocks();
    routerHook.mockReturnValue(router);
    params.mockReturnValue({ id: "4" });
    createHook.mockReturnValue(mutation());
    updateHook.mockReturnValue(mutation());
    businessHook.mockReturnValue({ data: { id: 4, name: "Shop", bannerImage: "old" }, isLoading: false, isError: false, refetch: jest.fn() });
    profileHook.mockReturnValue({ data: { user: {}, businesses: [] }, isLoading: false, isError: false, refetch: jest.fn() });
});

describe("profile mutation routes", () => {
    it("submits new and edited businesses before navigating back", async () => {
        const add = await render(<AddBusiness />);
        await fireEvent.press(screen.getByText("Submit business route"));
        expect(createHook.mock.results.at(-1)?.value[0]).toHaveBeenCalledWith(mockPayload);
        expect(router.back).toHaveBeenCalled();
        await add.unmount();

        await render(<EditBusiness />);
        await fireEvent.press(screen.getByText("Submit business route"));
        expect(updateHook.mock.results.at(-1)?.value[0]).toHaveBeenCalledWith({ businessId: 4, business: mockPayload });
        expect(router.back).toHaveBeenCalled();
    });

    it("renders edit-business invalid/loading/error states", async () => {
        params.mockReturnValue({ id: "bad" });
        const view = await render(<EditBusiness />);
        expect(screen.getByText("Business not found")).toBeTruthy();
        params.mockReturnValue({ id: "4" });
        businessHook.mockReturnValue({ isLoading: true, isError: false, refetch: jest.fn() });
        await view.rerender(<EditBusiness />);
        expect(screen.getByText("Loading business...")).toBeTruthy();
        const refetch = jest.fn();
        businessHook.mockReturnValue({ isLoading: false, isError: true, refetch });
        await view.rerender(<EditBusiness />);
        await fireEvent.press(screen.getByText("Tap to retry."));
        expect(refetch).toHaveBeenCalled();
    });

    it("renders account loading/error/data states and retries", async () => {
        profileHook.mockReturnValue({ isLoading: true, isError: false, refetch: jest.fn() });
        const view = await render(<EditBusinessAccount />);
        expect(screen.getByText("Loading profile...")).toBeTruthy();
        const refetch = jest.fn();
        profileHook.mockReturnValue({ isLoading: false, isError: true, refetch });
        await view.rerender(<EditBusinessAccount />);
        await fireEvent.press(screen.getByText("Tap to retry."));
        expect(refetch).toHaveBeenCalled();
        profileHook.mockReturnValue({ data: { user: {}, businesses: [] }, isLoading: false, isError: false, refetch });
        await view.rerender(<EditBusinessAccount />);
        expect(screen.getByText("Managed profile")).toBeTruthy();
    });
});
