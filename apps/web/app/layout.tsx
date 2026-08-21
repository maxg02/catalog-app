import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
    title: {
        default: "CatalogApp",
        template: "%s · CatalogApp",
    },
    description: "Discover curated products from local businesses.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${plusJakartaSans.variable} antialiased`}>
            <body className="min-h-screen">{children}</body>
        </html>
    );
}
