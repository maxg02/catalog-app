import HeaderContainer from "@/components/layout/headerContainer";
import { Button } from "@/components/ui/button";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ProductDto } from "interfaces";
import { CircleArrowLeftIcon, Share2Icon, ShoppingCartIcon } from "lucide-nativewind";
import React, { useMemo } from "react";
import { View, Image, Dimensions } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { testProducts as products } from "@/lib/utils";
import Carousel from "react-native-reanimated-carousel";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import NumericInput from "@/components/ui/numericInput";
import Card from "@/components/ui/card";

const width = Dimensions.get("window").width;

function ProductPage() {
    const router = useRouter();
    const scrollAmount = useSharedValue<number>(0);
    const caoruselProgress = useSharedValue<number>(0);
    const { id } = useLocalSearchParams();

    const selectedProduct = useMemo(() => {
        return products.find((p) => p.id === Number(id));
    }, [id]);

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event: any) => {
            scrollAmount.value = event.contentOffset.y;
        },
    });

    return selectedProduct ? (
        <Animated.ScrollView
            contentContainerClassName="bg-background py-3 gap-6 flex-1"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <Stack.Screen
                options={{
                    header: () => (
                        <HeaderContainer scrollAmount={scrollAmount}>
                            <Button variant={"ghost"} size={"icon"} onPress={() => router.back()}>
                                <CircleArrowLeftIcon size={30} />
                            </Button>
                            <View>
                                <Text className="font-jakarta-bold">{selectedProduct?.name}</Text>
                            </View>
                            <Share2Icon className="ml-auto text-primary" />
                        </HeaderContainer>
                    ),
                }}
            />
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
                            <View className="w-full h-full overflow-hidden bg-gray-200 rounded-xl">
                                <Image source={{ uri: item }} className="h-full" resizeMode="contain" />
                            </View>
                        )}
                    />
                </View>
                <View className="flex-row justify-between items-center px-4 gap-6">
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
            <View className="px-4 flex-row overflow-hidden justify-between gap-3">
                <NumericInput />
                <Button className="h-12 flex-1">
                    <Text>Add to cart</Text>
                    <ShoppingCartIcon className="text-primary-foreground" />
                </Button>
            </View>
            <View className="px-4 gap-6">
                <Card className="p-4">
                    <Text variant={"h3"}>Description</Text>
                    <Text variant={"muted"} className="mt-2">
                        {selectedProduct?.description}
                    </Text>
                </Card>
                <Card className="p-4">
                    <Text variant={"h3"}>Details</Text>
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
