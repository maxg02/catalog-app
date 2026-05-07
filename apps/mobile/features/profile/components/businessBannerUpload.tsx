import React from "react";
import { ImageBackground, View } from "react-native";
import { CameraIcon, ImagePlusIcon } from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type BusinessBannerUploadProps = {
    imageUrl?: string;
};

export default function BusinessBannerUpload({ imageUrl }: BusinessBannerUploadProps) {
    if (!imageUrl) {
        return (
            <View className="items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-8">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <CameraIcon size={32} className="text-primary" />
                </View>
                <View className="items-center gap-1">
                    <Text className="font-jakarta-bold">Business Banner</Text>
                    <Text variant={"muted"} className="max-w-56 text-center text-xs">
                        Show customers the storefront, team, or featured inventory
                    </Text>
                </View>
                <Button className="h-11 rounded-full px-6">
                    <Text className="font-jakarta-bold">Add Banner</Text>
                </Button>
            </View>
        );
    }

    return (
        <View className="gap-3">
            <View className="h-44 overflow-hidden rounded-3xl bg-secondary">
                <ImageBackground source={{ uri: imageUrl }} resizeMode="cover" className="flex-1">
                    <View className="flex-1 justify-end bg-black/20 p-4">
                        <Button className="self-start rounded-full">
                            <ImagePlusIcon size={18} className="text-primary-foreground" />
                            <Text className="font-jakarta-bold">Change Banner</Text>
                        </Button>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}

export type { BusinessBannerUploadProps };
