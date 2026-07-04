import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export {
    testProducts,
    testUser,
    testUserInsights,
} from "@internal/mock-data";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function toRgbChannels(color: string) {
    return color
        .split(/[,\s]+/)
        .filter(Boolean)
        .join(", ");
}

export function toRgb(color: string) {
    return `rgb(${toRgbChannels(color)})`;
}

export function toRgba(color: string, alpha: number) {
    return `rgba(${toRgbChannels(color)}, ${alpha})`;
}
