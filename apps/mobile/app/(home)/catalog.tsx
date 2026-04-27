import React, { useEffect } from "react";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import { testUser } from "@/lib/utils";

function Catalog() {
    const scrollAmount = useScrollAmount("catalog");
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
            contentContainerClassName="flex-grow items-center justify-center px-6 py-4"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="bg-background flex-1"
        >
            <Tabs.Screen options={{ title: "Catalog" }} />
            <View>
                <Text variant={"h1"}>Catalog</Text>
            </View>
        </Animated.ScrollView>
    );
}

export default Catalog;
