import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import Footer from "./footer";


const Icon = () => null;
const tabs = [
    { name: "insights", title: "Insights", label: "Insights", icon: Icon },
    { name: "index", title: "Catalog", label: "Catalog", icon: Icon },
    { name: "profile", title: "Profile", label: "Profile", icon: Icon },
];

function props(prevented = false) {
    return {
        state: {
            index: 0,
            routes: [
                { key: "insights-key", name: "insights" },
                { key: "index-key", name: "index", params: { q: "x" } },
                { key: "profile-key", name: "profile" },
            ],
        },
        navigation: {
            emit: jest.fn(() => ({ defaultPrevented: prevented })),
            navigate: jest.fn(),
        },
        descriptors: {},
        insets: { top: 0, right: 0, bottom: 0, left: 0 },
        tabs,
    } as unknown as React.ComponentProps<typeof Footer>;
}

describe("footer navigation", () => {
    it("emits tab presses, skips the active route, navigates inactive routes, and honors prevention", async () => {
        const active = props();
        const view = await render(<Footer {...active} />);
        await fireEvent.press(screen.getByText("Insights"));
        expect(active.navigation.navigate).not.toHaveBeenCalled();
        await fireEvent.press(screen.getByText("Catalog"));
        expect(active.navigation.navigate).toHaveBeenCalledWith("index", { q: "x" });

        const prevented = props(true);
        await view.rerender(<Footer {...prevented} />);
        await fireEvent.press(screen.getByText("Profile"));
        expect(prevented.navigation.emit).toHaveBeenCalledWith({
            type: "tabPress",
            target: "profile-key",
            canPreventDefault: true,
        });
        expect(prevented.navigation.navigate).not.toHaveBeenCalled();
    });
});
