import React, { useEffect, useState } from "react";
import { CoinsIcon, EyeIcon, PackageIcon, SaveIcon, StarIcon } from "lucide-nativewind";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import CheckControl from "@/components/ui/checkControl";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import ProductMediaUpload from "@/features/catalog/components/productMediaUpload";
import { IconInput } from "@/components/ui/iconInput";
import { cn } from "@/lib/utils";

type ProductVisibility = "public" | "draft";

function AddProduct() {
    const [onStock, setOnStock] = useState(true);
    const [featured, setFeatured] = useState(true);
    const [visibility, setVisibility] = useState<ProductVisibility>("public");
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
                    <IconInput
                        icon={CoinsIcon}
                        placeholder="0.00"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                    />
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
                <View className="overflow-hidden rounded-3xl border border-border bg-card">
                    <Pressable
                        className="flex-row items-center gap-3 border-b border-border px-4 py-4"
                        onPress={() => setOnStock((current) => !current)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: onStock }}
                    >
                        <PackageIcon size={20} className="text-muted-foreground" />
                        <View className="flex-1">
                            <Text className="font-jakarta-bold">In Stock</Text>
                            <Text variant={"muted"} className="text-xs">
                                Available for customers to buy
                            </Text>
                        </View>
                        <CheckControl checked={onStock} />
                    </Pressable>
                    <Pressable
                        className="flex-row items-center gap-3 border-b border-border px-4 py-4"
                        onPress={() => setFeatured((current) => !current)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: featured }}
                    >
                        <StarIcon size={20} className="text-muted-foreground" />
                        <View className="flex-1">
                            <Text className="font-jakarta-bold">Feature in Catalog</Text>
                            <Text variant={"muted"} className="text-xs">
                                Highlight at the top of your shop
                            </Text>
                        </View>
                        <CheckControl checked={featured} />
                    </Pressable>
                    <View className="flex-row items-center gap-3 px-4 py-4">
                        <EyeIcon size={20} className="text-muted-foreground" />
                        <View className="flex-1 gap-3">
                            <View>
                                <Text className="font-jakarta-bold">Visibility</Text>
                                <Text variant={"muted"} className="text-xs">
                                    Choose whether customers can see this product
                                </Text>
                            </View>
                            <View className="flex-row rounded-full bg-secondary p-1">
                                {(["public", "draft"] as const).map((option) => {
                                    const selected = visibility === option;

                                    return (
                                        <Pressable
                                            key={option}
                                            className={cn(
                                                "h-10 flex-1 items-center justify-center rounded-full",
                                                selected && "bg-card",
                                            )}
                                            onPress={() => setVisibility(option)}
                                            accessibilityRole="radio"
                                            accessibilityState={{ checked: selected }}
                                        >
                                            <Text
                                                className={cn(
                                                    "text-sm font-jakarta-bold capitalize",
                                                    selected
                                                        ? "text-foreground"
                                                        : "text-muted-foreground",
                                                )}
                                            >
                                                {option}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <Button className="h-14 rounded-full">
                <SaveIcon size={20} className="text-primary-foreground" />
                <Text className="font-jakarta-bold">Save Product</Text>
            </Button>
        </Animated.ScrollView>
    );
}

export default AddProduct;
