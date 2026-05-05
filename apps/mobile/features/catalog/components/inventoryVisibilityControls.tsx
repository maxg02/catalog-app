import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { EyeIcon, PackageIcon, StarIcon } from "lucide-nativewind";
import CheckControl from "@/components/ui/checkControl";
import NumericInput from "@/components/ui/numericInput";
import { Text } from "@/components/ui/text";

function InventoryVisibilityControls() {
    const [featured, setFeatured] = useState(true);
    const [active, setActive] = useState(true);

    return (
        <View className="overflow-hidden rounded-3xl border border-border bg-card">
            <View className="flex-row items-center gap-3 border-b border-border px-4 py-3">
                <PackageIcon size={20} className="text-muted-foreground" />
                <Text className="flex-1 font-jakarta-bold">Initial Stock</Text>
                <NumericInput value={1} className="w-32" />
            </View>
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
