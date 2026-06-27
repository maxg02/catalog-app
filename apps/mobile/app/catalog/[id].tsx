import React, { useEffect, useMemo, useState } from "react";
import { CoinsIcon, SaveIcon, TagIcon } from "lucide-nativewind";
import { Switch, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import IconCircle from "@/components/ui/iconCircle";
import { IconInput } from "@/components/ui/iconInput";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import InventoryVisibilityControls from "@/features/catalog/components/inventoryVisibilityControls";
import ProductMediaUpload from "@/features/catalog/components/productMediaUpload";
import { testProducts } from "@/lib/utils";
import DateTimeInput from "@/components/ui/dateTimeInput";

function EditProduct() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const selectedProduct = useMemo(
        () => testProducts.find((product) => product.id === Number(id)),
        [id],
    );
    const [saleEnabled, setSaleEnabled] = useState(false);
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

    useEffect(() => {
        setSaleEnabled(Boolean(selectedProduct?.sale));
    }, [selectedProduct]);

    if (!selectedProduct) {
        return (
            <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
                <Text variant={"h1"} className="text-center">
                    Product not found
                </Text>
                <Text variant={"muted"} className="text-center">
                    This product may have been removed from your catalog.
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
            <ProductMediaUpload productImages={selectedProduct.image} />

            <View className="gap-4">
                <Text variant={"h4"}>BASIC INFORMATION</Text>
                <View className="gap-2">
                    <Text variant={"h3"}>Product Name</Text>
                    <Input defaultValue={selectedProduct.name} placeholder="e.g. Handmade Ceramic Vase" />
                </View>
                <View className="gap-2">
                    <Text variant={"h3"}>Price</Text>
                    <IconInput
                        icon={CoinsIcon}
                        defaultValue={selectedProduct.price.toFixed(2)}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                    />
                </View>
                <Card className="gap-3 rounded-3xl px-4 py-4">
                    <View className="flex-row items-center gap-3">
                        <IconCircle icon={TagIcon} />
                        <View className="flex-1">
                            <Text variant={"h3"}>Enable Sale</Text>
                            <Text variant={"muted"} className="text-xs">
                                Show a temporary promotional price
                            </Text>
                        </View>
                        <Switch
                            value={saleEnabled}
                            onValueChange={setSaleEnabled}
                            trackColor={{ false: "#e5e7eb", true: "#13a4ec" }}
                            thumbColor="#ffffff"
                            ios_backgroundColor="#e5e7eb"
                            accessibilityLabel="Enable Sale"
                        />
                    </View>

                    {saleEnabled && (
                        <View className="gap-4 rounded-3xl bg-card p-4 shadow-sm shadow-black/5">
                            <IconInput
                                icon={CoinsIcon}
                                defaultValue={selectedProduct.price.toFixed(2)}
                                placeholder="0.00"
                                keyboardType="decimal-pad"
                                inputMode="decimal"
                            />
                            <DateTimeInput
                                mode="date"
                                placeholder="End Date (optional)"
                                initialDate={
                                    selectedProduct.saleEndDate
                                        ? new Date(selectedProduct.saleEndDate)
                                        : null
                                }
                            />
                        </View>
                    )}
                </Card>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Description</Text>
                    <Textarea
                        defaultValue={selectedProduct.description}
                        placeholder="Tell customers more about this item..."
                        className="min-h-32"
                    />
                </View>
            </View>

            <View className="gap-4">
                <Text variant={"h4"}>Inventory & Visibility</Text>
                <InventoryVisibilityControls
                    initialOnStock={selectedProduct.onStock}
                    initialFeatured={selectedProduct.trending}
                    initialActive={selectedProduct.isPublic}
                />
            </View>

            <Button className="h-14 rounded-full">
                <SaveIcon size={20} className="text-primary-foreground" />
                <Text className="font-jakarta-bold">Update Product</Text>
            </Button>
        </Animated.ScrollView>
    );
}

export default EditProduct;
