import React from "react";
import { Button } from "@/components/ui/button";
import { View } from "react-native";
import { HouseIcon, HeartIcon, ShoppingBagIcon, UserIcon } from "lucide-nativewind";
import { Text } from "@/components/ui/text";

function Footer() {
    return (
        <View className="flex flex-row items-center px-4 py-2 border-t border-border">
            <Button variant={"ghost"} className="flex flex-col flex-1 h-fit">
                <HouseIcon />
                <Text className="text-xs font-jakarta-medium">Discover</Text>
            </Button>
            <Button variant={"ghost"} className="flex flex-col flex-1 h-fit">
                <HeartIcon />
                <Text className="text-xs font-jakarta-medium">Saved</Text>
            </Button>
            <Button variant={"ghost"} className="flex flex-col flex-1 h-fit">
                <ShoppingBagIcon />
                <Text className="text-xs font-jakarta-medium">Orders</Text>
            </Button>
            <Button variant={"ghost"} className="flex flex-col flex-1 h-fit">
                <UserIcon />
                <Text className="text-xs font-jakarta-medium">Profile</Text>
            </Button>
        </View>
    );
}

export default Footer;
