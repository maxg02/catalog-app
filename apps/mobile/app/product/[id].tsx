import { Button } from "@/components/ui/button";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import { useLocalSearchParams } from "expo-router";
import { HeartIcon, ShoppingCartIcon } from "lucide-nativewind";
import React, { useEffect, useMemo } from "react";
import { View, Image, Dimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { cn, testProducts as products } from "@/lib/utils";
import Carousel from "react-native-reanimated-carousel";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";

const width = Dimensions.get("window").width;

function ProductPage() {
    const caoruselProgress = useSharedValue<number>(0);
    const scrollAmount = useScrollAmount();
    const { id } = useLocalSearchParams();

    const selectedProduct = useMemo(() => {
        return products.find((p) => p.id === Number(id));
    }, [id]);

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

    return selectedProduct ? (
        <Animated.ScrollView
            contentContainerClassName="bg-background pb-3 gap-6"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <View>
                <View className="w-full h-96">
                    <Carousel
                        data={selectedProduct?.image || []}
                        loop={true}
                        pagingEnabled={true}
                        snapEnabled={true}
                        mode="parallax"
                        width={width}
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        modeConfig={{
                            parallaxScrollingScale: 0.9,
                            parallaxScrollingOffset: 50,
                        }}
                        onProgressChange={(offsetProgress, absoluteProgress) => {
                            caoruselProgress.value = absoluteProgress;
                        }}
                        renderItem={({ item }) => (
                            <View className="w-full h-full overflow-hidden bg-gray-200 rounded-xl items-center">
                                <Image
                                    source={{ uri: item }}
                                    className="flex-1"
                                    resizeMode="contain"
                                    style={{ aspectRatio: "16/9" }}
                                />
                            </View>
                        )}
                    />
                </View>
                <View className="flex-row justify-between items-center px-6 gap-6">
                    <View className="items-start">
                        <Text variant={"h1"}>{selectedProduct?.name}</Text>
                        <View className="flex-row gap-2 items-center">
                            <Text variant={"h2"} className="text-primary">
                                {selectedProduct?.sale
                                    ? `$${selectedProduct?.salePrice?.toFixed(2)}`
                                    : `$${selectedProduct?.price.toFixed(2)}`}
                            </Text>
                            {selectedProduct?.sale && (
                                <Text className="text-muted-foreground/55 line-through text-xs">
                                    {`$${selectedProduct?.price.toFixed(2)}`}
                                </Text>
                            )}
                        </View>
                    </View>
                    <View>
                        <Badge
                            variant={
                                selectedProduct.stock > 5
                                    ? "default"
                                    : selectedProduct.stock < 1
                                      ? "destructive"
                                      : "warning"
                            }
                        >
                            <Text>
                                {selectedProduct?.stock > 5
                                    ? "In Stock"
                                    : selectedProduct?.stock < 1
                                      ? "Out of Stock"
                                      : `Only ${selectedProduct?.stock} left`}
                            </Text>
                        </Badge>
                    </View>
                </View>
            </View>
            <View className="px-6 flex-row overflow-hidden justify-between gap-3">
                <Button className="h-12 flex-1">
                    <ShoppingCartIcon className="text-primary-foreground" />
                    <Text>Add to cart</Text>
                </Button>
                <Button variant={"outline"} className="h-12">
                    <HeartIcon className="text-muted-foreground" />
                </Button>
            </View>
            <View className="px-6 gap-6">
                <Card className="p-4">
                    <Text variant={"h3"}>Description</Text>
                    <Text variant={"muted"} className="mt-2">
                        {selectedProduct?.description}
                    </Text>
                </Card>
                <Card className="p-4">
                    <Text variant={"h3"}>Details</Text>
                    <View className="mt-2 gap-3">
                        {Object.entries(selectedProduct?.details || {}).map(
                            ([key, value], index, arr) => (
                                <View
                                    key={index}
                                    className={cn(
                                        "flex-row justify-between mt-3 border-b border-muted-foreground/20 pb-3",
                                        index === arr.length - 1 && "border-b-0 pb-1",
                                    )}
                                >
                                    <Text variant={"muted"}>{key}</Text>
                                    <Text>{value}</Text>
                                </View>
                            ),
                        )}
                    </View>
                </Card>
            </View>
        </Animated.ScrollView>
    ) : (
        <View className="flex-1 items-center justify-center">
            <Text variant={"h1"}>Product not found</Text>
        </View>
    );
}

export default ProductPage;
