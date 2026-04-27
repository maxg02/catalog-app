import HeaderContainer from "@/components/layout/headerContainer";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";
import { testProducts as products } from "@/lib/utils";
import { ChevronLeftIcon, Share2Icon } from "lucide-nativewind";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { useSharedValue } from "react-native-reanimated";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductLayout() {
    const router = useRouter();
    const scrollAmount = useSharedValue(0);
    const { id } = useLocalSearchParams<{ id?: string | string[] }>();
    const selectedId = Array.isArray(id) ? id[0] : id;
    const selectedProduct = products.find((product) => product.id === Number(selectedId));

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollAmountContext.Provider value={scrollAmount}>
                <Stack
                    screenOptions={{
                        header: ({ navigation }) => (
                            <HeaderContainer scrollAmount={scrollAmount}>
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
                                    <Text variant={"h1"}>{selectedProduct?.name}</Text>
                                </View>
                                <Button
                                    variant={"ghost"}
                                    size={"icon"}
                                    className="ms-auto"
                                    onPress={() => router.back()}
                                >
                                    <Share2Icon className="ml-auto text-primary" />
                                </Button>
                            </HeaderContainer>
                        ),
                    }}
                />
            </ScrollAmountContext.Provider>
        </SafeAreaView>
    );
}
