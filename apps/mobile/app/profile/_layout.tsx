import React from "react";
import { Stack, useRouter } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import HeaderContainer from "@/components/layout/headerContainer";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";

export default function ProfileLayout() {
    const router = useRouter();
    const scrollAmount = useSharedValue(0);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <ScrollAmountContext.Provider value={scrollAmount}>
                <Stack
                    screenOptions={{
                        header: ({ options }) => (
                            <HeaderContainer scrollAmount={scrollAmount}>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="-ms-2"
                                    onPress={() => router.back()}
                                    accessibilityLabel="Go back"
                                >
                                    <ChevronLeftIcon size={28} className="text-foreground" />
                                </Button>
                                <View className="flex-1">
                                    <Text variant={"h1"} className="text-left">
                                        {options.title}
                                    </Text>
                                </View>
                            </HeaderContainer>
                        ),
                    }}
                />
            </ScrollAmountContext.Provider>
        </SafeAreaView>
    );
}
