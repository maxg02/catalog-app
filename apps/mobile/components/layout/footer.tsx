import React from "react";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { HomeTabConfig } from "@/lib/homeTabs";

type FooterProps = BottomTabBarProps & {
    tabs: HomeTabConfig[];
};

function Footer({ state, navigation, tabs }: FooterProps) {
    const activeRouteKey = state.routes[state.index]?.key;

    return (
        <SafeAreaView
            className="flex flex-row items-center shadow-lg shadow-black px-4 pb-1 bg-card"
            edges={["bottom"]}
        >
            {state.routes.map((route) => {
                const section = tabs.find((item) => item.name === route.name);
                if (!section) return null;

                const isActive = activeRouteKey === route.key;
                const Icon = section.icon;

                const handlePress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isActive && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                return (
                    <Button
                        key={route.key}
                        variant={"ghost"}
                        className={cn(
                            "flex flex-col flex-1 h-fit rounded-none pt-3 active:bg-card",
                            isActive && "border-t-4 border-t-primary",
                        )}
                        onPress={handlePress}
                        size={"icon"}
                    >
                        <Icon className={isActive ? "text-primary" : "text-muted-foreground"} />
                        <Text
                            className={cn(
                                "text-xs",
                                isActive
                                    ? "text-primary font-jakarta-bold"
                                    : "text-muted-foreground font-jakarta-medium",
                            )}
                        >
                            {section.label}
                        </Text>
                    </Button>
                );
            })}
        </SafeAreaView>
    );
}

export default Footer;
