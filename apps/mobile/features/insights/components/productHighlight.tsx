import React from "react";
import { Link } from "expo-router";
import { Image, Pressable, View } from "react-native";
import { HeartIcon, ReceiptTextIcon } from "lucide-nativewind";
import type { BusinessProductHighlight } from "interfaces";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

type ProductHighlightProps = {
    highlight: BusinessProductHighlight;
};

function ProductHighlight({ highlight }: ProductHighlightProps) {
    const { label, metric, product } = highlight;
    const price = product.sale ? product.salePrice : product.price;
    const Icon = label === "Most Saved" ? HeartIcon : ReceiptTextIcon;

    return (
        <Link asChild href={{ pathname: "/catalog/[id]", params: { id: product.id } }}>
            <Pressable
                className="flex-row items-center gap-3"
                accessibilityLabel={`Edit ${product.name}`}
            >
                <View className="h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                    <Image
                        source={{ uri: product.image[0] }}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1 gap-1">
                    <View className="flex-row items-center gap-2">
                        <Icon size={16} className="text-primary" />
                        <Text className="text-xs font-jakarta-bold text-primary">{label}</Text>
                    </View>
                    <Text variant={"h2"} numberOfLines={1} className="font-jakarta-bold">
                        {product.name}
                    </Text>
                    <Text className="font-jakarta-bold text-primary">${price?.toFixed(2)}</Text>
                </View>
                <Badge variant={"muted"}>
                    <Text className="text-xs">{metric}</Text>
                </Badge>
            </Pressable>
        </Link>
    );
}

export default ProductHighlight;
