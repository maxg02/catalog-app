import React, { useEffect } from "react";
import { Redirect, Tabs } from "expo-router";
import { UserRole } from "@internal/interfaces";
import { testCarts, testUser } from "@/lib/utils";
import CartCard from "@/features/cart/components/cartCard";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useScrollAmount } from "@/contexts/scrollAmountContext";

function Carts() {
    const scrollAmount = useScrollAmount("carts");
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

    if (testUser.role === UserRole.Business) {
        return <Redirect href="/insights" />;
    }

    return (
        <Animated.ScrollView
            contentContainerClassName="py-4 px-6 gap-6 bg-background"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <Tabs.Screen options={{ title: "My Carts" }} />
            {testCarts.map((c, key) => (
                <CartCard key={key} {...c} />
            ))}
        </Animated.ScrollView>
    );
}

export default Carts;
