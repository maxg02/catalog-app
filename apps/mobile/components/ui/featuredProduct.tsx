import React from "react";
import { ProductDto } from "interfaces";
import { View, Image, ImageBackground } from "react-native";
import { Text } from "@/components/ui/text";
import { LinearGradient } from "expo-linear-gradient";
import { Badge } from "./badge";

function FeaturedProduct(productData: ProductDto) {
    return (
        <ImageBackground
            source={{ uri: productData.image }}
            resizeMode="cover"
            className="h-52 aspect-[15/9] overflow-hidden border border-transparent rounded-3xl justify-end items-start"
        >
            {productData.trending ? (
                <Badge className="ms-3">
                    <Text>Trending</Text>
                </Badge>
            ) : productData.BestSeller ? (
                <Badge variant={"secondary"} className="ms-3">
                    <Text>Best Seller</Text>
                </Badge>
            ) : null}
            <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} className="p-3 w-full">
                <Text variant={"h2"} className="text-white">
                    {productData.name}
                </Text>
                <View className="flex-row gap-1">
                    <Text variant={"small"} className="text-white">
                        {productData.Sale
                            ? `$${productData.SalePrice?.toFixed(2)}`
                            : `$${productData.price.toFixed(2)}`}
                    </Text>
                    {productData.Sale && (
                        <Text className="text-white/50 line-through text-xs">
                            {`$${productData.price.toFixed(2)}`}
                        </Text>
                    )}
                </View>
            </LinearGradient>
        </ImageBackground>
    );
}

export default FeaturedProduct;
