import React from "react";
import { Link } from "expo-router";
import { Image, View } from "react-native";
import { CircleIcon, PencilIcon, StarIcon } from "lucide-nativewind";
import type { ProductDto } from "@internal/interfaces";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CatalogProductCardProps = ProductDto;

function CatalogProductCard(product: CatalogProductCardProps) {
    const price = product.sale ? product.salePrice : product.price;
    const currentPrice = `$${price?.toFixed(2)}`;
    const originalPrice = `$${product.price.toFixed(2)}`;

    const stockText = product.onStock ? "In stock" : "Out of stock";
    const stockClassName = cn(
        "text-sm font-jakarta-medium",
        product.onStock ? "text-muted-foreground" : "text-red-300",
    );

    return (
        <Card className="p-3">
            <View className="flex-row gap-3">
                <View className="w-24 overflow-hidden rounded-2xl bg-muted relative">
                    <Image
                        source={{ uri: product.image[0] }}
                        className="flex-grow flex-shrink-0 h-24"
                        resizeMode="cover"
                    />
                    {product.isFeatured && (
                        <StarIcon
                            className="absolute top-2 left-2 fill-yellow-400 stroke-none"
                            size={15}
                        />
                    )}
                </View>
                <View className="flex-1 justify-between gap-2">
                    <View className="gap-1 items-start">
                        <Text variant={"h3"} numberOfLines={2} className="w-full font-jakarta-bold">
                            {product.name}
                        </Text>
                        <View className="flex-row gap-2">
                            <Badge variant={product.isPublic ? "default" : "muted"}>
                                <CircleIcon className="stroke-none fill-card" size={10} />
                                <Text>{product.isPublic ? "Public" : "Draft"}</Text>
                            </Badge>
                            {product.sale && (
                                <Badge variant={"warning"}>
                                    <CircleIcon className="stroke-none fill-card" size={10} />
                                    <Text>Sale</Text>
                                </Badge>
                            )}
                        </View>

                        <View className="w-full">
                            {product.sale ? (
                                <View>
                                    <View className="flex-row gap-2 items-center">
                                        <Text className="font-jakarta-bold text-primary">
                                            {currentPrice}
                                        </Text>
                                        <Text className="line-through text-muted-foreground/20">
                                            {originalPrice}
                                        </Text>
                                    </View>
                                    <Text className={stockClassName}>{stockText}</Text>
                                </View>
                            ) : (
                                <View className="flex-row gap-2 items-center">
                                    <Text className="font-jakarta-bold text-primary">{currentPrice}</Text>
                                    <CircleIcon className="stroke-none fill-muted-foreground" size={5} />
                                    <Text className={stockClassName}>{stockText}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
                <View className="justify-center">
                    <Link asChild href={{ pathname: "/catalog/[id]", params: { id: product.id } }}>
                        <Button
                            size={"icon"}
                            variant={"outline"}
                            accessibilityLabel={`Edit ${product.name}`}
                        >
                            <PencilIcon className="text-primary" size={20} />
                        </Button>
                    </Link>
                </View>
            </View>
        </Card>
    );
}

export default CatalogProductCard;
export type { CatalogProductCardProps };
