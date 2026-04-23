import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Stack } from "expo-router";
import { testUser } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PencilIcon, PenIcon } from "lucide-nativewind";

function Profile() {
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

    const abbvName = testUser.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("");

    return (
        <Animated.ScrollView
            contentContainerClassName="py-4 px-6 gap-6"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="bg-background flex-1"
        >
            <Stack.Screen options={{ title: "Profile" }} />
            <View className="items-center">
                <View className="bg-primary/10 aspect-square h-28 justify-center rounded-full relative">
                    <Text variant={"h1"} className="text-primary">
                        {abbvName}
                    </Text>

                    <Button className="absolute -bottom-1 -right-1 rounded-full h-10 aspect-square p-0 items-center justify-center">
                        <PencilIcon size={15} className="text-primary-foreground" />
                    </Button>
                </View>
                <Text variant={"h2"} className="mt-4 text-center">
                    {testUser.name}
                </Text>
                <Text variant={"muted"} className="text-xs text-center mt-1" numberOfLines={1}>
                    {testUser.email}
                </Text>
            </View>
        </Animated.ScrollView>
    );
}

export default Profile;
