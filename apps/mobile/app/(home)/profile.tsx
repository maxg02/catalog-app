import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Tabs } from "expo-router";
import { testUser } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    BadgeQuestionMarkIcon,
    ChevronRightIcon,
    LogOutIcon,
    PencilIcon,
    SettingsIcon,
} from "lucide-nativewind";
import Card from "@/components/ui/card";

function Profile() {
    const scrollAmount = useScrollAmount("profile");
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
            <Tabs.Screen options={{ title: "Profile" }} />
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
            <Card className="px-1 py-2 mt-4">
                <Button variant={"ghost"} className="h-14 w-full rounded-2xl px-4 gap-3">
                    <SettingsIcon />
                    <Text className="text-base">Settings</Text>
                    <ChevronRightIcon size={18} className="ms-auto text-muted-foreground" />
                </Button>
                <View className="mx-4 h-px bg-border" />
                <Button variant={"ghost"} className="h-14 w-full justify-between rounded-2xl px-4 gap-3">
                    <BadgeQuestionMarkIcon />
                    <Text className="text-base">Help & Support</Text>
                    <ChevronRightIcon size={18} className="ms-auto text-muted-foreground" />
                </Button>
                <View className="mx-4 h-px bg-border" />
                <Button variant={"ghost"} className="h-14 w-full justify-start rounded-2xl px-4 gap-3">
                    <LogOutIcon className="text-destructive" />
                    <Text className="text-base text-destructive">Logout</Text>
                </Button>
            </Card>
        </Animated.ScrollView>
    );
}

export default Profile;
