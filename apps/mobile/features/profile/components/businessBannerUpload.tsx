import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Image, View } from "react-native";
import { CameraIcon, ImagePlusIcon, ImagesIcon, Trash2Icon } from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { ProductImageAsset } from "@/features/catalog/components/productMediaUpload";

type BusinessBannerUploadProps = {
    image: ProductImageAsset | null;
    onImageChange: (image: ProductImageAsset | null) => void;
    disabled?: boolean;
};

function getAssetName(uri: string) {
    return uri.split("/").pop() || "business-banner.jpg";
}

export default function BusinessBannerUpload({ image, onImageChange, disabled = false }: BusinessBannerUploadProps) {
    const setPickedImage = (asset: ImagePicker.ImagePickerAsset) => {
        onImageChange({
            uri: asset.uri,
            name: asset.fileName ?? getAssetName(asset.uri),
            type: asset.mimeType ?? "image/jpeg",
        });
    };

    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1 });

        if (!result.canceled) setPickedImage(result.assets[0]);
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Camera access needed", "Allow camera access to take a business banner photo.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 1 });

        if (!result.canceled) setPickedImage(result.assets[0]);
    };

    if (!image) {
        return (
            <View className="items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-8">
                <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <CameraIcon size={32} className="text-primary" />
                </View>
                <View className="items-center gap-1">
                    <Text className="font-jakarta-bold">Business Banner</Text>
                    <Text variant="muted" className="max-w-56 text-center text-xs">
                        Show customers the storefront, team, or featured inventory
                    </Text>
                </View>
                <View className="w-full flex-row gap-3">
                    <Button className="h-11 flex-1 rounded-full px-4" disabled={disabled} onPress={takePhoto}>
                        <CameraIcon size={18} className="text-primary-foreground" />
                        <Text className="font-jakarta-bold">Take Photo</Text>
                    </Button>
                    <Button variant="secondary" className="h-11 flex-1 rounded-full px-4" disabled={disabled} onPress={chooseImage}>
                        <ImagesIcon size={18} className="text-secondary-foreground" />
                        <Text className="font-jakarta-bold">Choose Photo</Text>
                    </Button>
                </View>
            </View>
        );
    }

    return (
        <View className="gap-3">
            <Image source={{ uri: image.uri }} className="h-44 w-full rounded-3xl" resizeMode="cover" />
            <View className="flex-row gap-3">
                <Button className="h-11 flex-1 rounded-full px-4" disabled={disabled} onPress={chooseImage}>
                    <ImagePlusIcon size={18} className="text-primary-foreground" />
                    <Text className="font-jakarta-bold">Change Banner</Text>
                </Button>
                <Button
                    variant="destructive"
                    size="icon"
                    className="h-11 w-11 rounded-full"
                    disabled={disabled}
                    accessibilityLabel="Remove banner"
                    onPress={() => onImageChange(null)}
                >
                    <Trash2Icon size={18} className="text-white" />
                </Button>
            </View>
        </View>
    );
}

export type { BusinessBannerUploadProps };


