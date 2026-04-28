import React, { useEffect } from "react";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import { testUser } from "@/lib/utils";
import HeaderContainer from "@/components/layout/headerContainer";
import { BellIcon, MapPinIcon, StoreIcon } from "lucide-nativewind";
import { Badge } from "@/components/ui/badge";

function Insights() {
    const scrollAmount = useScrollAmount("insights");
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) {
                scrollAmount.value = event.contentOffset.y;
            }
        },
    });

    useEffect(() => {
        if (scrollAmount) {
            scrollAmount.value = 0;
        }

        return () => {
            if (scrollAmount) {
                scrollAmount.value = 0;
            }
        };
    }, [scrollAmount]);

    if (testUser.rol === "customer") {
        return <Redirect href="/" />;
    }

    return (
        <Animated.ScrollView
            contentContainerClassName="px-6 py-4"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="bg-background flex-1"
        >
            <Tabs.Screen
                options={{
                    header: () => (
                        <HeaderContainer scrollAmount={scrollAmount}>
                            <StoreIcon className="text-primary" />
                            <View>
                                <Text className="text-xs text-muted-foreground font-jakarta-semibold">
                                    Analytics Dashboard
                                </Text>
                                <Text className="font-jakarta-bold">Mandinga, Santo Domingo</Text>
                            </View>
                            <BellIcon className="ml-auto" />
                        </HeaderContainer>
                    ),
                }}
            />
            <View className="flex flex-row items-center justify-between">
                <Text variant={"h1"}>Overview</Text>
                <Badge variant={"muted"}>
                    <Text variant={"muted"}>Last 24h</Text>
                </Badge>
            </View>
        </Animated.ScrollView>
    );
}

export default Insights;
