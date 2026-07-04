import React, { useEffect } from "react";
import { Stack } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import EditBusinessAccountForm from "@/features/profile/components/editBusinessAccountForm";
import { testUser } from "@/lib/utils";

function EditBusinessAccount() {
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
            className="flex-1 bg-background"
            contentContainerClassName="gap-7 px-6 pb-8"
            keyboardShouldPersistTaps="handled"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <Stack.Screen options={{ title: "Edit Account" }} />
            <EditBusinessAccountForm business={testUser} />
        </Animated.ScrollView>
    );
}

export default EditBusinessAccount;
