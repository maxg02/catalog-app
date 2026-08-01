import { BusinessCategories } from "@internal/enums";
import type { BusinessProfileDto, ProfileDto } from "@internal/interfaces";
import {
    emptyBusinessValues,
    getAccountValues,
    getAssetName,
    getBusinessFormValues,
    getCountryCode,
    getLocation,
    getStateCode,
    getSubmitErrorData,
    nullableText,
    withCurrentOption,
} from "./formLogic";

const business = {
    id: 4,
    name: " Shop ",
    bannerImage: null,
    description: null,
    category: null,
    location: null,
    userId: 1,
} satisfies BusinessProfileDto;

describe("profile form logic", () => {
    it("maps account and business initial values", () => {
        const profile = { user: { name: "Ada", email: "a@b.co" }, businesses: [] } as unknown as ProfileDto;
        expect(getAccountValues(profile)).toEqual({
            name: "Ada",
            email: "a@b.co",
            password: "",
            confirmPassword: "",
        });
        expect(getBusinessFormValues(business)).toEqual({ ...emptyBusinessValues, name: " Shop " });
        expect(
            getBusinessFormValues({
                ...business,
                category: BusinessCategories.TECH,
                description: "Devices",
                location: { address: " 1 Main ", city: "SD", country: "DO" },
            }),
        ).toMatchObject({ category: BusinessCategories.TECH, description: "Devices", city: "SD" });
    });

    it("trims nullable text and builds all-or-nothing location", () => {
        expect(nullableText("  ")).toBeNull();
        expect(nullableText(" hi ")).toBe("hi");
        expect(getLocation(emptyBusinessValues)).toBeNull();
        expect(getLocation({ ...emptyBusinessValues, address: " A ", city: " C " })).toEqual({
            address: "A",
            city: "C",
            country: "",
        });
    });

    it("resolves country/state codes and preserves unavailable current options", () => {
        const countries = [{ id: "DO", name: "Dominican Republic", flagUrl: "flag" }];
        const states = [{ name: "Distrito Nacional", countryCode: "DO", stateCode: "01" }];
        expect(getCountryCode(countries, "Dominican Republic")).toBe("DO");
        expect(getCountryCode(countries, "missing")).toBe("");
        expect(getStateCode(states, "Distrito Nacional")).toBe("01");
        expect(getStateCode(states, "missing")).toBe("");
        expect(withCurrentOption([{ label: "Known", value: "K" }], " Legacy ")).toEqual([
            { label: "Legacy", value: "Legacy" },
            { label: "Known", value: "K" },
        ]);
        expect(withCurrentOption([{ label: "Known", value: "K" }], "Known")).toHaveLength(1);
    });

    it("parses API error envelopes and filename fallbacks", () => {
        expect(getSubmitErrorData<{ error: string }>({ data: { error: "no" } })).toEqual({ error: "no" });
        expect(getSubmitErrorData(null)).toBeUndefined();
        expect(getSubmitErrorData({ data: "no" })).toBeUndefined();
        expect(getAssetName("file:///photos/banner.png")).toBe("banner.png");
        expect(getAssetName("", "fallback.jpg")).toBe("fallback.jpg");
    });
});
