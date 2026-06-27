import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Tabs, useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { UserRole } from "@internal/interfaces";
import {
    ChevronRightIcon,
    CircleHelpIcon,
    LogOutIcon,
    SettingsIcon,
    UserCogIcon,
} from "lucide-nativewind";
import Card from "@/components/ui/card";
import BusinessProfileDetails from "@/features/profile/components/businessProfileDetails";
import { useGetUserInformationQueryState } from "@/features/profile/api/profileApi";

function Profile() {
    const router = useRouter();
    const scrollAmount = useScrollAmount("profile");
    const {
        data: userInformation,
        isLoading: isUserInformationLoading,
        isError: isUserInformationError,
    } = useGetUserInformationQueryState(undefined);
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

    const userName = userInformation?.name ?? (isUserInformationLoading ? "Loading..." : "Unavailable");
    const userEmail = userInformation?.email ?? "";
    const abbvName = userName
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
                </View>
                <Text variant={"h2"} className="mt-4 text-center">
                    {userName}
                </Text>
                <Text variant={"muted"} className="text-xs text-center mt-1" numberOfLines={1}>
                    {isUserInformationError ? "Unable to load profile information" : userEmail}
                </Text>
            </View>

            {userInformation?.role === UserRole.Business && (
                <BusinessProfileDetails business={userInformation} />
            )}

            <Card className="px-1 py-2">
                <Button
                    variant={"ghost"}
                    className="h-14 w-full rounded-2xl px-4 gap-3"
                    onPress={() => router.push("/profile/edit")}
                >
                    <UserCogIcon className="text-foreground" />
                    <Text className="text-base">Edit Account</Text>
                    <ChevronRightIcon size={18} className="ms-auto text-muted-foreground" />
                </Button>
                <View className="mx-4 h-px bg-border" />
                <Button
                    variant={"ghost"}
                    className="h-14 w-full rounded-2xl px-4 gap-3"
                    onPress={() => router.push("/profile/settings")}
                >
                    <SettingsIcon className="text-foreground" />
                    <Text className="text-base">Settings</Text>
                    <ChevronRightIcon size={18} className="ms-auto text-muted-foreground" />
                </Button>
                <View className="mx-4 h-px bg-border" />
                <Button variant={"ghost"} className="h-14 w-full justify-between rounded-2xl px-4 gap-3">
                    <CircleHelpIcon className="text-foreground" />
                    <Text className="text-base">Help & Support</Text>
                    <ChevronRightIcon size={18} className="ms-auto text-muted-foreground" />
                </Button>
                <View className="mx-4 h-px bg-border" />
                <Button variant={"ghost"} className="h-14 w-full justify-start rounded-2xl px-4 gap-3">
                    <LogOutIcon className="text-destructive" />
                    <Text className="text-base text-destructive group-active:text-destructive">
                        Logout
                    </Text>
                </Button>
            </Card>
        </Animated.ScrollView>
    );
}

export default Profile;
