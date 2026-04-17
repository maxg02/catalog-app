import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { StoreIcon } from "lucide-nativewind";
import { testSavedProductLists } from "@/lib/utils";
import SavedProductCard from "@/components/ui/savedProductCard";

function Saved() {
    return (
        <ScrollView contentContainerClassName="p-4 gap-6 bg-background">
            <Stack.Screen options={{ title: "Saved Products" }} />
            {testSavedProductLists.map((sp, key) => (
                <View key={key} className="gap-3">
                    <View className="flex-row gap-2 items-center">
                        <StoreIcon className="text-primary" size={18} />
                        <Text variant={"muted"} className="font-jakarta-bold text-xs uppercase">
                            {sp.businessName}
                        </Text>
                    </View>
                    {sp.productData.map((p, key) => (
                        <SavedProductCard key={key} {...p} />
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

export default Saved;
