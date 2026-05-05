import React, { useEffect } from "react";
import { CoinsIcon, CreditCardIcon, SaveIcon } from "lucide-nativewind";
import { View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import InventoryVisibilityControls from "@/features/catalog/components/inventoryVisibilityControls";
import ProductMediaUpload from "@/features/catalog/components/productMediaUpload";

function AddProduct() {
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
            className="flex-1 bg-background"
            contentContainerClassName="gap-7 px-6 pb-8"
            keyboardShouldPersistTaps="handled"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <ProductMediaUpload />

            <View className="gap-4">
                <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                    Basic Information
                </Text>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Product Name</Text>
                    <Input placeholder="e.g. Handmade Ceramic Vase" />
                </View>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Price</Text>
                    <View className="bg-input rounded-2xl flex-row items-center px-4">
                        <CoinsIcon size={18} className="text-muted-foreground" />
                        <Input placeholder="0.00" keyboardType="decimal-pad" inputMode="decimal" />
                    </View>
                </View>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Description</Text>
                    <Textarea placeholder="Tell customers more about this item..." className="min-h-32" />
                </View>
            </View>

            <View className="gap-4">
                <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                    Inventory & Visibility
                </Text>
                <InventoryVisibilityControls />
            </View>

            <Button className="h-14 rounded-full">
                <SaveIcon size={20} className="text-primary-foreground" />
                <Text className="font-jakarta-bold">Save Product</Text>
            </Button>
        </Animated.ScrollView>
    );
}

export default AddProduct;
