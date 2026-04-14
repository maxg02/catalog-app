import React, { useState, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    HouseIcon,
    HeartIcon,
    ShoppingBagIcon,
    UserIcon,
    LucidePropsWithClassName,
    ShoppingCartIcon,
} from "lucide-nativewind";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Href, usePathname, useRouter } from "expo-router";

const footerSections: {
    pathname: Href;
    name: string;
    icon: (props: LucidePropsWithClassName) => React.ReactNode;
}[] = [
    { pathname: "/", name: "Discover", icon: HouseIcon },
    { pathname: "/saved", name: "Saved", icon: HeartIcon },
    { pathname: "/orders", name: "Orders", icon: ShoppingBagIcon },
    { pathname: "/carts", name: "Carts", icon: ShoppingCartIcon },
    { pathname: "/profile", name: "Profile", icon: UserIcon },
];

function Footer() {
    const pathname = usePathname();
    const router = useRouter();

    const currentSection =
        footerSections.find((section) => section.pathname === pathname)?.name ?? "Discover";

    return (
        <SafeAreaView
            className="flex flex-row items-center shadow-lg shadow-black px-4 pb-1 bg-card"
            edges={["bottom"]}
        >
            {footerSections.map((section) => {
                const isActive = currentSection === section.name;
                return (
                    <Button
                        key={section.name}
                        variant={"ghost"}
                        className={cn(
                            "flex flex-col flex-1 h-fit rounded-none pt-3 active:bg-card",
                            isActive && "border-t-4 border-t-primary",
                        )}
                        onPress={() => router.push(section.pathname)}
                        size={"icon"}
                    >
                        {section.icon && (
                            <section.icon
                                className={isActive ? "text-primary" : "text-muted-foreground"}
                            />
                        )}
                        <Text
                            className={cn(
                                "text-xs",
                                isActive
                                    ? "text-primary font-jakarta-bold"
                                    : "text-muted-foreground font-jakarta-medium",
                            )}
                        >
                            {section.name}
                        </Text>
                    </Button>
                );
            })}
        </SafeAreaView>
    );
}

export default Footer;
