import type React from "react";
import type { LucidePropsWithClassName } from "lucide-nativewind";
import {
    ChartNoAxesColumnIcon,
    ClipboardListIcon,
    HeartIcon,
    HouseIcon,
    PackageIcon,
    ShoppingCartIcon,
    UserIcon,
} from "lucide-nativewind";

export type HomeTabConfig = {
    name: string;
    title: string;
    label: string;
    icon: (props: LucidePropsWithClassName) => React.ReactNode;
};

export const customerHomeTabs: HomeTabConfig[] = [
    { name: "index", title: "Discover", label: "Discover", icon: HouseIcon },
    { name: "saved", title: "Saved Products", label: "Saved", icon: HeartIcon },
    { name: "carts", title: "My Carts", label: "Carts", icon: ShoppingCartIcon },
    { name: "profile", title: "Profile", label: "Profile", icon: UserIcon },
];

export const businessHomeTabs: HomeTabConfig[] = [
    { name: "insights", title: "Insights", label: "Insights", icon: ChartNoAxesColumnIcon },
    { name: "catalog", title: "Catalog", label: "Catalog", icon: PackageIcon },
    { name: "orders", title: "Orders", label: "Orders", icon: ClipboardListIcon },
    { name: "profile", title: "Profile", label: "Profile", icon: UserIcon },
];

export const homeTabs = [...customerHomeTabs, ...businessHomeTabs].filter(
    (tab, index, tabs) => tabs.findIndex((item) => item.name === tab.name) === index,
);
