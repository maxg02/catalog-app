/** @type {import('tailwindcss').Config} */
import { hairlineWidth } from "nativewind/theme";

export const content = [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/index.tsx",
];
export const darkMode = "class";
export const presets = [require("nativewind/preset")];
export const theme = {
    extend: {
        fontFamily: {
            "jakarta-extralight": ["PlusJakartaSans_200ExtraLight"],
            "jakarta-light": ["PlusJakartaSans_300Light"],
            jakarta: ["PlusJakartaSans_400Regular"],
            "jakarta-medium": ["PlusJakartaSans_500Medium"],
            "jakarta-semibold": ["PlusJakartaSans_600SemiBold"],
            "jakarta-bold": ["PlusJakartaSans_700Bold"],
            "jakarta-extrabold": ["PlusJakartaSans_800ExtraBold"],
        },
        colors: {
            border: "rgb(var(--border) / <alpha-value>)",
            input: "rgb(var(--input) / <alpha-value>)",
            ring: "rgb(var(--ring) / <alpha-value>)",
            background: "rgb(var(--background) / <alpha-value>)",
            foreground: "rgb(var(--foreground) / <alpha-value>)",
            primary: {
                DEFAULT: "rgb(var(--primary) / <alpha-value>)",
                foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
            },
            secondary: {
                DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
                foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
            },
            destructive: {
                DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
                foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
            },
            muted: {
                DEFAULT: "rgb(var(--muted) / <alpha-value>)",
                foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
            },
            accent: {
                DEFAULT: "rgb(var(--accent) / <alpha-value>)",
                foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
            },
            card: {
                DEFAULT: "rgb(var(--card) / <alpha-value>)",
                foreground: "rgb(var(--card-foreground) / <alpha-value>)",
            },
        },
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        borderWidth: {
            hairline: hairlineWidth(),
        },
        keyframes: {
            "accordion-down": {
                from: { height: "0" },
                to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
                from: { height: "var(--radix-accordion-content-height)" },
                to: { height: "0" },
            },
        },
        animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
        },
    },
};
export const future = {
    hoverOnlyWhenSupported: true,
};
export const plugins = [];
