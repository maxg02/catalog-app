import { BusinessCategories } from "@internal/enums";
import type { BusinessLocationDto } from "@internal/interfaces";

type BusinessBody = {
    name?: unknown;
    bannerAction?: unknown;
    bannerImage?: unknown;
    description?: unknown;
    category?: unknown;
    location?: unknown;
};

export type BusinessInput = {
    name: string;
    description: string | null;
    category: number | null;
    location: BusinessLocationDto | null;
};

type BusinessValidationResult =
    | { ok: true; business: BusinessInput }
    | { ok: false; fieldErrors: Record<string, string> };

function nullableText(value: unknown) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getLocation(value: unknown) {
    if (value == null) return null;
    if (typeof value !== "object") return undefined;
    const location = value as Partial<Record<keyof BusinessLocationDto, unknown>>;
    const address = nullableText(location.address) ?? "";
    const city = nullableText(location.city) ?? "";
    const country = nullableText(location.country) ?? "";
    return address || city || country ? { address, city, country } : null;
}

export async function parseBusinessBody(request: Request) {
    try {
        if ((request.headers.get("content-type") ?? "").includes("multipart/form-data")) {
            const formData = await request.formData();
            const rawLocation = formData.get("location");
            let location: unknown = rawLocation;
            if (typeof rawLocation === "string") {
                try { location = JSON.parse(rawLocation); } catch {}
            }
            return {
                name: formData.get("name"),
                description: formData.get("description"),
                category: formData.get("category"),
                location,
                bannerAction: formData.get("bannerAction"),
                bannerImage: formData.get("bannerImage"),
            } as BusinessBody;
        }
        return (await request.json()) as BusinessBody;
    } catch {
        return null;
    }
}

export function validateBusinessBody(body: unknown): BusinessValidationResult {
    const fieldErrors: Record<string, string> = {};
    const input = (body ?? {}) as BusinessBody;
    const name = nullableText(input.name);
    const location = getLocation(input.location);
    const category = typeof input.category === "string" && input.category.trim() ? Number(input.category) : input.category;

    if (!name) fieldErrors.name = "Business name is required.";
    if (location === undefined) fieldErrors.location = "Location is invalid.";
    if (category != null && (!Number.isInteger(category) || typeof BusinessCategories[category as number] !== "string")) {
        fieldErrors.category = "Category is invalid.";
    }
    if (Object.keys(fieldErrors).length > 0 || !name || location === undefined) return { ok: false, fieldErrors };

    return {
        ok: true,
        business: {
            name,
            description: nullableText(input.description),
            category: category == null ? null : (category as number) + 1,
            location,
        },
    };
}
