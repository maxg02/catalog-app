import type React from "react";
import type { LucidePropsWithClassName } from "lucide-nativewind";
import { ChartNoAxesColumnIcon, PackageIcon, UserIcon } from "lucide-nativewind";

export type HomeTabConfig = {
    name: string;
    title: string;
    label: string;
    icon: (props: LucidePropsWithClassName) => React.ReactNode;
};

export const businessHomeTabs: HomeTabConfig[] = [
    { name: "insights", title: "Insights", label: "Insights", icon: ChartNoAxesColumnIcon },
    { name: "index", title: "Catalog", label: "Catalog", icon: PackageIcon },
    { name: "profile", title: "Profile", label: "Profile", icon: UserIcon },
];
