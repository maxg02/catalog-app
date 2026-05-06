import React from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { ChevronLeftIcon } from "lucide-nativewind";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSharedValue } from "react-native-reanimated";
import HeaderContainer from "@/components/layout/headerContainer";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";

export default function CatalogLayout() {
    const router = useRouter();
    const pathname = usePathname();
    const scrollAmount = useSharedValue(0);
    const isEditRoute = pathname !== "/catalog/add";

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <ScrollAmountContext.Provider value={scrollAmount}>
                <Stack
                    screenOptions={{
                        header: () => (
                            <HeaderContainer scrollAmount={scrollAmount}>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="-ms-2"
                                    onPress={() => router.back()}
                                    accessibilityLabel="Go back"
                                >
                                    <ChevronLeftIcon size={28} />
                                </Button>
                                <View className="flex-1">
                                    <Text variant={"h1"} className="text-left">
                                        {isEditRoute ? "Edit Product" : "Add New Product"}
                                    </Text>
                                </View>
                                <Button variant={"ghost"} className="px-0">
                                    <Text className="font-jakarta-bold text-primary">Preview</Text>
                                </Button>
                            </HeaderContainer>
                        ),
                    }}
                />
            </ScrollAmountContext.Provider>
        </SafeAreaView>
    );
}
