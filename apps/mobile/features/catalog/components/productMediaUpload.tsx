import React from "react";
import { CameraIcon } from "lucide-nativewind";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

function ProductMediaUpload() {
    return (
        <View className="items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-8">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <CameraIcon size={32} className="text-primary" />
            </View>
            <View className="items-center gap-1">
                <Text className="font-jakarta-bold">Product Media</Text>
                <Text variant={"muted"} className="max-w-56 text-center text-xs">
                    High quality photos increase sales by up to 40%
                </Text>
            </View>
            <Button className="h-11 rounded-full px-6">
                <Text className="font-jakarta-bold">Add Photo</Text>
            </Button>
        </View>
    );
}

export default ProductMediaUpload;
