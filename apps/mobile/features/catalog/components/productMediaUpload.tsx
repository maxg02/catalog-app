import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, ImagesIcon } from "lucide-nativewind";
import { Alert, Image, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ProductImagesModal from "@/features/catalog/components/productImagesModal";

type ProductImageAsset = {
    uri: string;
    name: string;
    type: string;
    isExisting?: boolean;
};

type ProductMediaUploadProps = {
    images: ProductImageAsset[];
    mainImageIndex: number | null;
    onImagesChange: (images: ProductImageAsset[]) => void;
    onMainImageIndexChange: (index: number | null) => void;
    disabled?: boolean;
};

const MAX_IMAGES = 4;

function getAssetName(uri: string, index: number) {
    return uri.split("/").pop() || `product-image-${index + 1}.jpg`;
}

function ProductMediaUpload({
    images,
    mainImageIndex,
    onImagesChange,
    onMainImageIndexChange,
    disabled = false,
}: ProductMediaUploadProps) {
    const [visible, setVisible] = useState(false);
    const hasProductImages = images.length > 0;
    const canAddImages = images.length < MAX_IMAGES;
    const imageUris = images.map((image) => image.uri);

    const addImages = (newImages: ProductImageAsset[]) => {
        const nextImages = [...images, ...newImages].slice(0, MAX_IMAGES);

        onImagesChange(nextImages);

        if (mainImageIndex === null && nextImages.length > 0) {
            onMainImageIndexChange(0);
        }
    };

    const handleChooseImages = async () => {
        if (!canAddImages) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: MAX_IMAGES - images.length,
            quality: 1,
        });

        if (!result.canceled) {
            addImages(
                result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    name: asset.fileName ?? getAssetName(asset.uri, index),
                    type: asset.mimeType ?? "image/jpeg",
                })),
            );
        }
    };

    const handleTakePhoto = async () => {
        if (!canAddImages) {
            return;
        }

        const permission = await ImagePicker.requestCameraPermissionsAsync();

        if (!permission.granted) {
            Alert.alert("Camera access needed", "Allow camera access to take a product photo.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            quality: 1,
        });

        if (!result.canceled) {
            addImages(
                result.assets.map((asset, index) => ({
                    uri: asset.uri,
                    name: asset.fileName ?? getAssetName(asset.uri, index),
                    type: asset.mimeType ?? "image/jpeg",
                })),
            );
        }
    };

    const handleDeleteImage = (selectedIndex: number) => {
        const nextImages = images.filter((_, index) => index !== selectedIndex);

        onImagesChange(nextImages);

        if (nextImages.length === 0) {
            onMainImageIndexChange(null);
        } else if (mainImageIndex === selectedIndex) {
            onMainImageIndexChange(0);
        } else if (mainImageIndex !== null && selectedIndex < mainImageIndex) {
            onMainImageIndexChange(mainImageIndex - 1);
        }
    };

    return (
        <View className="items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-8">
            {hasProductImages ? (
                <View className="w-full flex-row gap-3">
                    {imageUris.slice(0, 3).map((imageUri, key) => (
                        <Image
                            key={`${imageUri}-${key}`}
                            source={{ uri: imageUri }}
                            className="flex-1 aspect-square rounded-2xl"
                            resizeMode="cover"
                        />
                    ))}
                    {images.length < 3 &&
                        Array.from({ length: MAX_IMAGES - images.length }, (_, key) => (
                            <View key={key} className="flex-1 aspect-square" />
                        ))}
                    {images.length > 3 && (
                        <View className="flex-1 aspect-square items-center justify-center rounded-2xl bg-muted">
                            <Text variant={"h2"} className="text-primary">
                                +{images.length - 3}
                            </Text>
                        </View>
                    )}
                </View>
            ) : (
                <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <CameraIcon size={32} className="text-primary" />
                </View>
            )}
            <View className="items-center gap-1">
                <Text className="font-jakarta-bold">Product Media</Text>
                <Text variant={"muted"} className="max-w-56 text-center text-xs">
                    High quality photos increase sales by up to 40%
                </Text>
            </View>
            {hasProductImages ? (
                <Button className="h-11 rounded-full px-6" onPress={() => setVisible(true)}>
                    <Text className="font-jakarta-bold">Manage Photos</Text>
                </Button>
            ) : (
                <View className="w-full flex-row gap-3">
                    <Button
                        className="h-11 flex-1 rounded-full px-4"
                        onPress={handleTakePhoto}
                        disabled={disabled}
                    >
                        <CameraIcon size={18} className="text-primary-foreground" />
                        <Text className="font-jakarta-bold">Take Photo</Text>
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-11 flex-1 rounded-full px-4"
                        onPress={handleChooseImages}
                        disabled={disabled}
                    >
                        <ImagesIcon size={18} className="text-secondary-foreground" />
                        <Text className="font-jakarta-bold">Choose Photos</Text>
                    </Button>
                </View>
            )}

            <ProductImagesModal
                visible={visible}
                images={imageUris}
                mainImageIndex={mainImageIndex}
                canAddImages={canAddImages}
                onClose={() => setVisible(false)}
                onChooseImages={handleChooseImages}
                onTakePhoto={handleTakePhoto}
                onDeleteImage={handleDeleteImage}
                onSelectMainImage={onMainImageIndexChange}
            />
        </View>
    );
}

export default ProductMediaUpload;
export type { ProductImageAsset };


