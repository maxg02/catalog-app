import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { StoreIcon } from "lucide-nativewind";
import { testSavedProductLists } from "@/lib/utils";
import SavedProductCard from "@/components/ui/savedProductCard";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useScrollAmount } from "@/contexts/scrollAmountContext";

function Saved() {
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
            contentContainerClassName="py-4 px-6 gap-6"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="bg-background flex-1"
        >
            <Stack.Screen options={{ title: "Saved Products" }} />
            {testSavedProductLists.map((sp, key) => (
                <View key={key} className="gap-3">
                    <View className="flex-row gap-2 items-center">
                        <StoreIcon className="text-primary" size={18} />
                        <Text variant={"muted"} className="font-jakarta-bold text-xs uppercase">
                            {sp.businessName}
                        </Text>
                    </View>
                    {sp.productData.map((p, key) => (
                        <SavedProductCard key={key} {...p} />
                    ))}
                </View>
            ))}
        </Animated.ScrollView>
    );
}

export default Saved;
