import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { StoreIcon } from "lucide-nativewind";

function Saved() {
    return (
        <ScrollView className="px-4">
            <Stack.Screen options={{ title: "Saved Products" }} />
            <View>
                <View className="flex-row gap-2 items-center">
                    <StoreIcon className="text-primary" size={18} />
                    <Text variant={"muted"} className="font-jakarta-bold text-xs">
                        NEGOCIO EL PEPE
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

export default Saved;
