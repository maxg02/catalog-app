import HeaderContainer from "@/components/layout/headerContainer";
import { router, Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { useSharedValue } from "react-native-reanimated";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";
import { ChevronLeftIcon } from "lucide-nativewind";

export default function CartLayout() {
    const scrollAmount = useSharedValue(0);

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollAmountContext.Provider value={scrollAmount}>
                <Stack
                    screenOptions={{
                        header: ({ options, navigation }) => (
                            <HeaderContainer scrollAmount={scrollAmount}>
                                <View className="flex-1 flex-row items-center">
                                    {navigation.canGoBack() ? (
                                        <Button
                                            variant={"ghost"}
                                            size={"icon"}
                                            className="-ms-2"
                                            onPress={() => router.back()}
                                        >
                                            <ChevronLeftIcon size={28} />
                                        </Button>
                                    ) : (
                                        <View className="h-12 w-12" />
                                    )}
                                    <View className="flex-1 items-center">
                                        <Text variant={"h1"} className="font-jakarta-bold">
                                            {options.title}
                                        </Text>
                                    </View>
                                    <View className="h-12 w-12" />
                                </View>
                            </HeaderContainer>
                        ),
                    }}
                />
            </ScrollAmountContext.Provider>
        </SafeAreaView>
    );
}
