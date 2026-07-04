import React, { useEffect, useMemo, useState } from "react";
import { CoinsIcon, EyeIcon, PackageIcon, SaveIcon, StarIcon, TagIcon } from "lucide-nativewind";
import { Pressable, Switch, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import CheckControl from "@/components/ui/checkControl";
import IconCircle from "@/components/ui/iconCircle";
import { IconInput } from "@/components/ui/iconInput";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import ProductMediaUpload, { type ProductImageAsset } from "@/features/catalog/components/productMediaUpload";
import { testProducts, cn } from "@/lib/utils";
import DateTimeInput from "@/components/ui/dateTimeInput";

type ProductVisibility = "public" | "draft";

function EditProduct() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const selectedProduct = useMemo(
        () => testProducts.find((product) => product.id === Number(id)),
        [id],
    );
    const [saleEnabled, setSaleEnabled] = useState(false);
    const [onStock, setOnStock] = useState(true);
    const [isFeatured, setIsFeatured] = useState(true);
    const [visibility, setVisibility] = useState<ProductVisibility>("public");
    const [images, setImages] = useState<ProductImageAsset[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
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
        setOnStock(Boolean(selectedProduct?.onStock));
        setIsFeatured(Boolean(selectedProduct?.isFeatured));
        setVisibility(selectedProduct?.isPublic ? "public" : "draft");
        const nextImages =
            selectedProduct?.image.map((uri, index) => ({
                uri,
                name: `product-image-${index + 1}.jpg`,
                type: "image/jpeg",
            })) ?? [];

        setImages(nextImages);
        setMainImageIndex(nextImages.length > 0 ? 0 : null);
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
            <ProductMediaUpload
                images={images}
                mainImageIndex={mainImageIndex}
                onImagesChange={setImages}
                onMainImageIndexChange={setMainImageIndex}
            />

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
                        onPress={() => setIsFeatured((current) => !current)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isFeatured }}
                    >
                        <StarIcon size={20} className="text-muted-foreground" />
                        <View className="flex-1">
                            <Text className="font-jakarta-bold">Feature in Catalog</Text>
                            <Text variant={"muted"} className="text-xs">
                                Highlight at the top of your shop
                            </Text>
                        </View>
                        <CheckControl checked={isFeatured} />
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
                <Text className="font-jakarta-bold">Update Product</Text>
            </Button>
        </Animated.ScrollView>
    );
}

export default EditProduct;

