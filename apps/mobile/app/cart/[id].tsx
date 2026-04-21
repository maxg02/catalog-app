import React, { useEffect, useMemo } from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Stack, useLocalSearchParams } from "expo-router";
import { cn, testCarts } from "@/lib/utils";
import NumericInput from "@/components/ui/numericInput";
import { Textarea } from "@/components/ui/textarea";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SendIcon, StoreIcon } from "lucide-nativewind";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useScrollAmount } from "@/contexts/scrollAmountContext";

function Cart() {
    const { id } = useLocalSearchParams();
    const scrollAmount = useScrollAmount();

    const selectedCart = useMemo(() => {
        return testCarts.find((c) => c.id === Number(id));
    }, [id]);

    const totalDiscount = selectedCart ? selectedCart.cartTotal - selectedCart.saleTotal : 0;
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
        <View className="flex-1 bg-background">
            <Stack.Screen options={{ title: "My Cart" }} />
            <Animated.ScrollView
                className="flex-1"
                contentContainerClassName="py-4 px-6 gap-6"
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View className="bg-primary/10 py-4 rounded-2xl flex-row gap-2 items-center justify-center">
                    <StoreIcon className="text-primary" size={18} />
                    <Text className="text-primary text-sm font-jakarta-bold text-center">
                        Shopping from: {selectedCart?.businessData.name}
                    </Text>
                </View>
                <View className="gap-4">
                    {selectedCart?.productData.map((p, key) => (
                        <View
                            key={key}
                            className={cn(
                                "flex-row gap-4 items-center pb-4",
                                key !== selectedCart.productData.length - 1 &&
                                    "border-b-[1px] border-muted-foreground/10",
                            )}
                        >
                            <Image
                                source={{ uri: p.image[0] }}
                                className="h-20 aspect-square rounded-2xl"
                            />
                            <View className="flex-1 gap-1">
                                <Text
                                    variant={"h2"}
                                    numberOfLines={2}
                                    className="font-jakarta-bold leading-tight"
                                >
                                    {p.name}
                                </Text>
                                <View className="flex-row gap-1">
                                    <Text className="font-jakarta-bold text-primary">
                                        {p.sale
                                            ? `$${p.salePrice?.toFixed(2)}`
                                            : `$${p.price.toFixed(2)}`}
                                    </Text>
                                    {p.sale && (
                                        <Text className="text-muted-foreground/55 line-through text-xs">
                                            {`$${p.price.toFixed(2)}`}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <NumericInput value={p.quantity} className="w-36" />
                        </View>
                    ))}
                </View>
                <View>
                    <Text variant={"small"} className="text-muted-foreground mb-2">
                        Special Instructions
                    </Text>
                    <Textarea placeholder="Anything else the business should know?" />
                </View>
            </Animated.ScrollView>
            <Card className="rounded-none px-6 py-5 gap-3 shadow-md shadow-black/10">
                <View className="flex-row items-center justify-between">
                    <Text variant={"muted"}>Subtotal</Text>
                    <Text className="font-jakarta-bold">
                        ${selectedCart?.cartTotal.toFixed(2) ?? "0.00"}
                    </Text>
                </View>
                <View className="flex-row items-center justify-between">
                    <Text variant={"muted"}>Total Discount</Text>
                    <Text className="font-jakarta-bold text-muted-foreground">
                        -${totalDiscount.toFixed(2)}
                    </Text>
                </View>
                <View className="border-t border-dashed border-border/70" />
                <View className="flex-row items-center justify-between">
                    <Text variant={"h3"}>Total Estimate</Text>
                    <Text variant={"h2"} className="text-primary">
                        ${selectedCart?.saleTotal.toFixed(2) ?? "0.00"}
                    </Text>
                </View>
                <View className="mt-3 items-center gap-3">
                    <Button className="w-full flex-row gap-4">
                        <SendIcon className="text-primary-foreground" />
                        <Text>Send Order via Whatsapp</Text>
                    </Button>
                    <Text variant={"muted"} className="text-xs">
                        OPENS WHATSAPP TO FINALIZE YOUR ORDER
                    </Text>
                </View>
            </Card>
        </View>
    );
}

export default Cart;
