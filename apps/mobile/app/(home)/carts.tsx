import React from "react";
import { ScrollView, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Stack } from "expo-router";
import { StoreIcon } from "lucide-nativewind";
import { testCarts } from "@/lib/utils";
import SavedProductCard from "@/components/ui/savedProductCard";
import CartCard from "@/components/ui/cartCard";

function Carts() {
    return (
        <ScrollView contentContainerClassName="py-4 px-6 gap-6 bg-background">
            <Stack.Screen options={{ title: "Saved Products" }} />
            {testCarts.map((c, key) => (
                <CartCard key={key} {...c} />
            ))}
        </ScrollView>
    );
}

export default Carts;
