import React from "react";
import { View, Image, ImageBackground } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "./button";
import { StarIcon } from "lucide-nativewind";
import { BusinessDto, CartDto } from "interfaces";
import { BusinessCategories } from "enums";
import { Link } from "expo-router";
import { Badge } from "./badge";
import Card from "./card";
import { LinearGradient } from "expo-linear-gradient";

function CartCard(cartData: CartDto) {
    return (
        <Card>
            <ImageBackground
                source={{ uri: cartData.businessData.image }}
                resizeMode="cover"
                className="h-52 overflow-hidden border border-transparent rounded-3xl rounded-b-none justify-end items-start"
            >
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.6)"]} className="px-4 py-3 w-full">
                    <Text variant={"h1"} className="text-white text-left">
                        {cartData.businessData.name}
                    </Text>
                    <View className="flex-row gap-1">
                        <Text className="text-xs text-gray-200">
                            {BusinessCategories[cartData.businessData.category]}
                        </Text>
                    </View>
                </LinearGradient>
            </ImageBackground>
            <View className="py-4 px-6">
                <Text>Pepe</Text>
            </View>
        </Card>
    );
}

export default CartCard;
