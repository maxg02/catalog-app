import React from "react";
import { View, Image, ImageBackground } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { CartDto } from "interfaces";
import { BusinessCategories } from "enums";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

function CartCard(cartData: CartDto) {
    return (
        <Card>
            <ImageBackground
                source={{ uri: cartData.businessData.image }}
                resizeMode="cover"
                className="h-52 overflow-hidden border border-transparent rounded-3xl rounded-b-none justify-end items-start"
            >
                {cartData.saleTotal < cartData.cartTotal && (
                    <Badge variant={"warning"} className="mb-auto ms-auto mt-3 me-4">
                        <Text>Products In Sale</Text>
                    </Badge>
                )}
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} className="px-4 py-3 w-full">
                    <Text variant={"h1"} className="text-white text-left">
                        {cartData.businessData.name}
                    </Text>
                    <View className="flex-row gap-1">
                        <Text className="text-xs text-gray-200">
                            {BusinessCategories[cartData.businessData.category]}
                        </Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
            <View className="py-4 px-6 gap-6">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text variant={"muted"}>{cartData.productData.length} items</Text>
                        <View>
                            <View className="flex-row gap-2 items-baseline">
                                <Text variant={"h1"} className="text-primary">
                                    ${cartData.saleTotal.toFixed(2)}
                                </Text>
                                {cartData.saleTotal < cartData.cartTotal && (
                                    <Text className="text-muted-foreground/55 line-through text-xs self-start">
                                        {`$${cartData.cartTotal.toFixed(2)}`}
                                    </Text>
                                )}
                                <Text variant={"muted"} className="text-xs">
                                    Est. Total
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Link href={{ pathname: "/cart/[id]", params: { id: cartData.id } }} asChild>
                        <Button>
                            <Text>View Cart</Text>
                        </Button>
                    </Link>
                </View>
                <View className="flex-row gap-3">
                    {cartData.productData.slice(0, 3).map((item, key) => (
                        <Image
                            key={key}
                            source={{ uri: item.image[0] }}
                            className="flex-1 aspect-square rounded-2xl"
                        />
                    ))}
                    {cartData.productData.length < 3 &&
                        Array.from({ length: 4 - cartData.productData.length }, (_, key) => (
                            <View key={key} className="flex-1 aspect-square" />
                        ))}
                    {cartData.productData.length > 3 && (
                        <View className="flex-1 aspect-square rounded-2xl bg-gray-200 items-center justify-center">
                            <Text variant={"h2"} className="text-primary">
                                +{cartData.productData.length - 3}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Card>
    );
}
export default CartCard;
