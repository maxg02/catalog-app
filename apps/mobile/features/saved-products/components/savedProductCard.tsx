import { ProductDto } from "@internal/interfaces";
import React from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { CircleIcon, HeartIcon, ShoppingCartIcon } from "lucide-nativewind";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "expo-router";
import Card from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SavedProductCard(savedProduct: ProductDto) {
    return (
        <Card className="w-full overflow-hidden flex-row gap-2 p-2 items-stretch">
            <View className="bg-gray-200 w-40 rounded-2xl overflow-hidden justify-end relative">
                <Image source={{ uri: savedProduct.image[0] }} className="flex-1" resizeMode="cover" />
                {savedProduct.sale && (
                    <Badge variant={"warning"} className="bg-warning absolute top-3 left-3">
                        <Text>Sale</Text>
                    </Badge>
                )}
            </View>
            <View className="justify-between p-1 py-2 flex-1 gap-4">
                <View className="flex-row">
                    <View className="gap-1 overflow-hidden flex-1">
                        <View className="flex-row gap-3 overflow-hidden">
                            <Text
                                variant={"h2"}
                                numberOfLines={2}
                                className="font-jakarta-bold leading-tight"
                            >
                                {savedProduct.name}
                            </Text>
                        </View>
                        <View className="flex-row gap-2">
                            <Text className="font-jakarta-bold text-primary">
                                {savedProduct.sale
                                    ? `$${savedProduct.salePrice?.toFixed(2)}`
                                    : `$${savedProduct.price.toFixed(2)}`}
                            </Text>
                            {savedProduct.sale && (
                                <Text className="text-muted-foreground/55 line-through text-xs">
                                    {`$${savedProduct.price.toFixed(2)}`}
                                </Text>
                            )}
                        </View>
                        <View className="flex-row gap-1 items-center">
                            <CircleIcon
                                className={cn(
                                    "stroke-none",
                                    savedProduct.onStock ? "fill-green-300" : "fill-gray-300",
                                )}
                                size={12}
                            />
                            <Text variant={"muted"} className="text-xs">
                                {savedProduct.onStock ? "In Stock" : "Out of Stock"}
                            </Text>
                        </View>
                    </View>
                    <View>
                        <Button size={"icon"} variant={"ghost"}>
                            <HeartIcon className="stroke-none fill-red-600" />
                        </Button>
                    </View>
                </View>
                <View className="flex-row gap-3">
                    <Link asChild href={{ pathname: "/product/[id]", params: { id: savedProduct.id } }}>
                        <Button className="flex-1">
                            <Text>View Details</Text>
                        </Button>
                    </Link>
                    <Button variant={"outline"} size={"icon"}>
                        <ShoppingCartIcon className="text-muted-foreground" />
                    </Button>
                </View>
            </View>
        </Card>
    );
}

export default SavedProductCard;
