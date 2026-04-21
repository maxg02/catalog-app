import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { testCarts } from "@/lib/utils";
import CartCard from "@/features/cart/components/cartCard";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useScrollAmount } from "@/contexts/scrollAmountContext";

function Carts() {
    const scrollAmount = useScrollAmount();
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

    return (
        <Animated.ScrollView
            contentContainerClassName="py-4 px-6 gap-6 bg-background"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <Stack.Screen options={{ title: "My Carts" }} />
            {testCarts.map((c, key) => (
                <CartCard key={key} {...c} />
            ))}
        </Animated.ScrollView>
    );
}

export default Carts;
