import { ProductDto } from "@internal/interfaces";
import React from "react";
import { View, Image, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { CircleIcon } from "lucide-nativewind";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "expo-router";

interface ProductCardProps extends ProductDto {
    horizontal?: boolean;
}

function ProductCard(productData: ProductCardProps) {
    return (
        <Link asChild href={{ pathname: "/product/[id]", params: { id: productData.id } }}>
            <Pressable
                className={cn("w-full overflow-hidden", productData.horizontal && "flex-row gap-2")}
            >
                <View
                    className={cn(
                        "bg-gray-200 h-40 w-full rounded-3xl overflow-hidden justify-end relative",
                        productData.horizontal && "w-1/2",
                    )}
                >
                    <Image
                        source={{ uri: productData.image[0] }}
                        className="w-auto h-full"
                        resizeMode="cover"
                    />
                    {productData.sale && (
                        <Badge variant={"warning"} className="bg-warning absolute top-3 left-3">
                            <Text>Sale</Text>
                        </Badge>
                    )}
                </View>
                <View className={cn("p-2 gap-1 overflow-hidden", productData.horizontal && "flex-1 p-1")}>
                    <Text
                        variant={"h2"}
                        numberOfLines={productData.horizontal ? 2 : 1}
                        className={cn(
                            "font-jakarta-bold leading-tight",
                            !productData.horizontal && "flex-1",
                        )}
                    >
                        {productData.name}
                    </Text>
                    <Text variant={"muted"} numberOfLines={2} className="text-xs">
                        {productData.description}
                    </Text>
                    <View className="flex-row gap-2">
                        <Text className="font-jakarta-bold text-primary">
                            {productData.sale
                                ? `$${productData.salePrice?.toFixed(2)}`
                                : `$${productData.price.toFixed(2)}`}
                        </Text>
                        {productData.sale && (
                            <Text className="text-muted-foreground/55 line-through text-xs">
                                {`$${productData.price.toFixed(2)}`}
                            </Text>
                        )}
                    </View>
                    <View className="flex-row gap-1 items-center">
                        <CircleIcon
                            className={cn(
                                "stroke-none",
                                productData.onStock ? "fill-green-300" : "fill-gray-300",
                            )}
                            size={12}
                        />
                        <Text variant={"muted"} className="text-xs">
                            {productData.onStock ? "In Stock" : "Out of Stock"}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}

export default ProductCard;
