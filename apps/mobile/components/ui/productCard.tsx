import { ProductDto } from "interfaces";
import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { CircleIcon } from "lucide-nativewind";
import { cn } from "@/lib/utils";

function ProductCard(productData: ProductDto) {
    return (
        <View className="w-full overflow-hidden">
            <View className="bg-gray-300 h-40 w-full border rounded-3xl overflow-hidden justify-end p-2">
                {/* <Image
                    source={{ uri: productData.image }}
                    className="w-auto h-full rounded-lg overflow-hidden justify-end p-2"
                    resizeMode="center"
                /> */}
            </View>
            <View className="p-2 gap-1">
                <Text variant={"h2"} numberOfLines={1} className="font-jakarta-bold flex-1">
                    {productData.name}
                </Text>
                <View className="flex-row gap-2">
                    <Text className="font-jakarta-bold text-primary">
                        {productData.Sale
                            ? `$${productData.SalePrice?.toFixed(2)}`
                            : `$${productData.price.toFixed(2)}`}
                    </Text>
                    {productData.Sale && (
                        <Text className="text-muted-foreground/55 line-through text-xs">
                            {`$${productData.price.toFixed(2)}`}
                        </Text>
                    )}
                </View>
                <View className="flex-row gap-1 items-center">
                    <CircleIcon
                        className={cn(
                            "stroke-none",
                            productData.Stock > 5
                                ? "fill-green-300"
                                : productData.Stock < 1
                                  ? "fill-gray-300"
                                  : "fill-orange-300",
                        )}
                        size={12}
                    />
                    <Text variant={"muted"} className="text-xs">
                        {productData.Stock > 5
                            ? "In Stock"
                            : productData.Stock < 1
                              ? "Out of Stock"
                              : `Only ${productData.Stock} left`}
                    </Text>
                </View>
            </View>
        </View>
    );
}

export default ProductCard;
