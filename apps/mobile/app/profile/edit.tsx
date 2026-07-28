import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import ManageAccountBusinessesForm from "@/features/profile/components/editBusinessAccountForm";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";

function EditBusinessAccount() {
    const scrollAmount = useScrollAmount();
    const { data: profile, isLoading, isError, refetch } = useGetProfileQuery();
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

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
                <Stack.Screen options={{ title: "Manage Account" }} />
                <ActivityIndicator size="large" />
                <Text variant="muted">Loading profile...</Text>
            </View>
        );
    }

    if (isError || !profile) {
        return (
            <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
                <Stack.Screen options={{ title: "Manage Account" }} />
                <Text variant="h1" className="text-center">
                    Unable to load profile
                </Text>
                <Text variant="muted" className="text-center" onPress={() => refetch()}>
                    Tap to retry.
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
            <Stack.Screen options={{ title: "Manage Account" }} />
            <ManageAccountBusinessesForm profile={profile} />
        </Animated.ScrollView>
    );
}

export default EditBusinessAccount;
