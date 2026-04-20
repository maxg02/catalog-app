import React, { useMemo } from "react";
import { ScrollView, View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Stack, useLocalSearchParams } from "expo-router";
import { StoreIcon } from "lucide-nativewind";
import { cn, testCarts } from "@/lib/utils";
import SavedProductCard from "@/components/ui/savedProductCard";
import CartCard from "@/components/ui/cartCard";
import NumericInput from "@/components/ui/numericInput";
import { Textarea } from "@/components/ui/textarea";

function Cart() {
    const { id } = useLocalSearchParams();

    const selectedCart = useMemo(() => {
        return testCarts.find((c) => c.id === Number(id));
    }, [id]);

    return (
        <ScrollView contentContainerClassName="py-4 gap-6 bg-background">
            <Stack.Screen
                options={{ title: `My Cart: ${selectedCart?.businessData.name || "Unknown"}` }}
            />
            <View className="px-6 gap-4">
                {selectedCart?.productData.map((p, key) => (
                    <View
                        key={key}
                        className={cn(
                            "flex-row gap-4 items-center pb-4",
                            key !== selectedCart.productData.length - 1 &&
                                "border-b-[1px] border-muted-foreground/10",
                        )}
                    >
                        <Image source={{ uri: p.image[0] }} className="h-28 aspect-square rounded-2xl" />
                        <View className="flex-1">
                            <Text
                                variant={"h2"}
                                numberOfLines={2}
                                className="font-jakarta-bold leading-tight"
                            >
                                {p.name}
                            </Text>
                            <View className="flex-row gap-2">
                                <Text className="font-jakarta-bold text-primary">
                                    {p.sale ? `$${p.salePrice?.toFixed(2)}` : `$${p.price.toFixed(2)}`}
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
            <View className="px-6">
                <Text variant={"small"} className="text-muted-foreground mb-2">
                    Special Instructions
                </Text>
                <Textarea placeholder="Anything else the business should know?" />
            </View>
        </ScrollView>
    );
}

export default Cart;
