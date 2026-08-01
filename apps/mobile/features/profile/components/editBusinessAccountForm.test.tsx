import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import type { ProfileDto } from "@internal/interfaces";
import ManageAccountBusinessesForm from "./editBusinessAccountForm";
import { useDeleteBusinessMutation, useUpdateUserMutation } from "@/features/profile/api/profileApi";

jest.mock("lucide-nativewind", () => new Proxy({}, { get: () => () => null }));
jest.mock("@/components/ui/dropdownMenu", () => ({ __esModule: true, default: () => null }));
jest.mock("@/features/profile/api/profileApi", () => ({
    useDeleteBusinessMutation: jest.fn(),
    useUpdateUserMutation: jest.fn(),
}));

const updateHook = useUpdateUserMutation as jest.Mock;
const deleteHook = useDeleteBusinessMutation as jest.Mock;
const profile = {
    user: { id: 1, name: "Ada", email: "ada@example.com", role: "business" },
    businesses: [],
} as unknown as ProfileDto;

function mutation(result: unknown, isLoading = false) {
    const unwrap = jest.fn();
    if (result instanceof Error || (typeof result === "object" && result && "data" in result)) unwrap.mockRejectedValue(result);
    else unwrap.mockResolvedValue(result);
    return [jest.fn(() => ({ unwrap })), { isLoading }] as const;
}

beforeEach(() => {
    updateHook.mockReturnValue(mutation({}));
    deleteHook.mockReturnValue(mutation(undefined));
});

describe("account form", () => {
    it("validates fields and submits trimmed optional-password values", async () => {
        const update = mutation({});
        updateHook.mockReturnValue(update);
        await render(<ManageAccountBusinessesForm profile={profile} />);
        await fireEvent.changeText(screen.getByPlaceholderText("Your name"), " ");
        await fireEvent.changeText(screen.getByPlaceholderText("you@email.com"), "bad");
        await fireEvent.press(screen.getByText("Update Account"));
        expect(await screen.findByText("Name is required.")).toBeTruthy();
        expect(screen.getByText("Valid email is required.")).toBeTruthy();

        await fireEvent.changeText(screen.getByPlaceholderText("Your name"), " Ada Lovelace ");
        await fireEvent.changeText(screen.getByPlaceholderText("you@email.com"), " ada@math.io ");
        await fireEvent.press(screen.getByText("Update Account"));
        await waitFor(() => expect(update[0]).toHaveBeenCalledWith({
            name: "Ada Lovelace",
            email: "ada@math.io",
            password: undefined,
        }));
    });

    it("maps server field errors and loading state", async () => {
        updateHook.mockReturnValue(mutation({ data: { error: "Update failed", fieldErrors: { email: "Already used" } } }));
        const view = await render(<ManageAccountBusinessesForm profile={profile} />);
        await fireEvent.press(screen.getByText("Update Account"));
        expect(await screen.findByText("Already used")).toBeTruthy();
        expect(screen.getByText("Update failed")).toBeTruthy();

        updateHook.mockReturnValue(mutation({}, true));
        await view.rerender(<ManageAccountBusinessesForm profile={profile} />);
        expect(screen.getAllByText("Updating account...")).toHaveLength(2);
    });
});
