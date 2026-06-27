import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { EyeIcon, PackageIcon, StarIcon } from "lucide-nativewind";
import CheckControl from "@/components/ui/checkControl";
import { Text } from "@/components/ui/text";

type InventoryVisibilityControlsProps = {
    initialOnStock?: boolean;
    initialFeatured?: boolean;
    initialActive?: boolean;
};

function InventoryVisibilityControls({
    initialOnStock = true,
    initialFeatured = true,
    initialActive = true,
}: InventoryVisibilityControlsProps) {
    const [onStock, setOnStock] = useState(initialOnStock);
    const [featured, setFeatured] = useState(initialFeatured);
    const [active, setActive] = useState(initialActive);

    return (
        <View className="overflow-hidden rounded-3xl border border-border bg-card">
            <Pressable
                className="flex-row items-center gap-3 border-b border-border px-4 py-4"
                onPress={() => setOnStock((current) => !current)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: onStock }}
            >
                <PackageIcon size={20} className="text-muted-foreground" />
                <View className="flex-1">
                    <Text className="font-jakarta-bold">In Stock</Text>
                    <Text variant={"muted"} className="text-xs">
                        Available for customers to buy
                    </Text>
                </View>
                <CheckControl checked={onStock} />
            </Pressable>
            <Pressable
                className="flex-row items-center gap-3 border-b border-border px-4 py-4"
                onPress={() => setFeatured((current) => !current)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: featured }}
            >
                <StarIcon size={20} className="text-muted-foreground" />
                <View className="flex-1">
                    <Text className="font-jakarta-bold">Feature in Catalog</Text>
                    <Text variant={"muted"} className="text-xs">
                        Highlight at the top of your shop
                    </Text>
                </View>
                <CheckControl checked={featured} />
            </Pressable>
            <Pressable
                className="flex-row items-center gap-3 px-4 py-4"
                onPress={() => setActive((current) => !current)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: active }}
            >
                <EyeIcon size={20} className="text-muted-foreground" />
                <View className="flex-1">
                    <Text className="font-jakarta-bold">Active Status</Text>
                    <Text variant={"muted"} className="text-xs">
                        Available for customers to buy
                    </Text>
                </View>
                <CheckControl checked={active} />
            </Pressable>
        </View>
    );
}

export default InventoryVisibilityControls;
