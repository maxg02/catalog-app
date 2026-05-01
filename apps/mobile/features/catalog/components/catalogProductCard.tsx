import React from "react";
import { Image, View } from "react-native";
import { EyeIcon, FilePenLineIcon, PencilIcon } from "lucide-nativewind";
import type { ProductDto } from "interfaces";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CatalogProductCardProps = ProductDto;

function CatalogProductCard(product: CatalogProductCardProps) {
    const price = product.sale ? product.salePrice : product.price;
    const isPublic = product.status === "public";
    const StatusIcon = isPublic ? EyeIcon : FilePenLineIcon;

    return (
        <Card className="p-3">
            <View className="flex-row gap-3">
                <View className="h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                    <Image
                        source={{ uri: product.image[0] }}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1 justify-between gap-2">
                    <View className="gap-1 items-start">
                        <Text variant={"h3"} numberOfLines={2} className="flex-1 font-jakarta-bold">
                            {product.name}
                        </Text>
                        <Badge variant={isPublic ? "default" : "muted"}>
                            <StatusIcon size={12} className="text-primary-foreground" />
                            <Text>{isPublic ? "Public" : "Draft"}</Text>
                        </Badge>
                        <Text className="font-jakarta-bold text-primary">${price?.toFixed(2)}</Text>
                    </View>
                    <Text
                        className={cn(
                            "text-xs font-jakarta-bold",
                            product.stock > 5
                                ? "text-primary"
                                : product.stock < 1
                                  ? "text-muted-foreground"
                                  : "text-warning",
                        )}
                    >
                        {product.stock > 5
                            ? `${product.stock} in stock`
                            : product.stock < 1
                              ? "Out of stock"
                              : `Only ${product.stock} left`}
                    </Text>
                    {product.sale && (
                        <Text className="text-xs text-muted-foreground line-through">
                            ${product.price.toFixed(2)}
                        </Text>
                    )}
                </View>
                <View className="justify-center">
                    <Button size={"icon"}>
                        <PencilIcon className="text-primary-foreground" size={20} />
                    </Button>
                </View>
            </View>
        </Card>
    );
}

export default CatalogProductCard;
export type { CatalogProductCardProps };
