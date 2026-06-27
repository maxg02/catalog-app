import React, { useEffect } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { UserRole } from "@internal/interfaces";
import { Text } from "@/components/ui/text";
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

    if (testUser.role !== UserRole.Business) {
        return (
            <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
                <Text variant={"h1"} className="text-center">
                    Business account not found
                </Text>
                <Text variant={"muted"} className="text-center">
                    This form is available for business profiles.
                </Text>
            </View>
        );
    }

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
