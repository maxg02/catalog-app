import { BusinessCategories } from "@internal/enums";
import type { BusinessLocationDto, BusinessProfileDto, ProfileDto } from "@internal/interfaces";
import type { CountryDto, StateDto } from "@/features/profile/api/profileApi";

export type AccountFormValues = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type BusinessFormValues = {
    name: string;
    category: BusinessCategories;
    description: string;
    address: string;
    city: string;
    country: string;
};

export const emptyBusinessValues: BusinessFormValues = {
    name: "",
    category: BusinessCategories.FOOD,
    description: "",
    address: "",
    city: "",
    country: "",
};

export function getAccountValues(profile: ProfileDto): AccountFormValues {
    return { name: profile.user.name, email: profile.user.email, password: "", confirmPassword: "" };
}

export function getBusinessFormValues(business: BusinessProfileDto): BusinessFormValues {
    return {
        name: business.name,
        category: business.category ?? BusinessCategories.FOOD,
        description: business.description ?? "",
        address: business.location?.address ?? "",
        city: business.location?.city ?? "",
        country: business.location?.country ?? "",
    };
}

export function nullableText(value: string) {
    return value.trim() || null;
}

export function getLocation(values: BusinessFormValues): BusinessLocationDto | null {
    const location = {
        address: values.address.trim(),
        city: values.city.trim(),
        country: values.country.trim(),
    };

    return Object.values(location).some(Boolean) ? location : null;
}

export function getSubmitErrorData<T>(error: unknown) {
    if (typeof error !== "object" || !error || !("data" in error)) return undefined;
    const data = (error as { data?: unknown }).data;
    return typeof data === "object" && data ? (data as T) : undefined;
}

export function getCountryCode(countries: CountryDto[], value: string) {
    return countries.find((country) => country.id === value || country.name === value)?.id ?? "";
}

export function getStateCode(states: StateDto[], value: string) {
    return states.find((state) => state.stateCode === value || state.name === value)?.stateCode ?? "";
}

export function withCurrentOption(options: { label: string; value: string }[], current: string) {
    const value = current.trim();
    return value && !options.some((option) => option.value === value || option.label === value)
        ? [{ label: value, value }, ...options]
        : options;
}

export function getAssetName(uri: string, fallback = "business-banner.jpg") {
    return uri.split("/").pop() || fallback;
}
