import React, { useEffect, useState } from "react";
import { CameraIcon } from "lucide-nativewind";
import { Image, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ProductImagesModal from "@/features/catalog/components/productImagesModal";

type ProductMediaUploadProps = {
    productImages?: string[];
};

function ProductMediaUpload({ productImages = [] }: ProductMediaUploadProps) {
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState(productImages);
    const hasProductImages = images.length > 0;

    useEffect(() => {
        setImages(productImages);
    }, [productImages]);

    const handleDeleteImage = (selectedIndex: number) => {
        setImages((currentImages) => currentImages.filter((_, index) => index !== selectedIndex));
    };

    return (
        <View className="items-center gap-4 rounded-3xl border border-dashed border-border bg-card px-6 py-8">
            {hasProductImages ? (
                <View className="w-full flex-row gap-3">
                    {images.slice(0, 3).map((imageUri, key) => (
                        <Image
                            key={`${imageUri}-${key}`}
                            source={{ uri: imageUri }}
                            className="flex-1 aspect-square rounded-2xl"
                            resizeMode="cover"
                        />
                    ))}
                    {images.length < 3 &&
                        Array.from({ length: 4 - images.length }, (_, key) => (
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
            <Button className="h-11 rounded-full px-6" onPress={() => setVisible(true)}>
                <Text className="font-jakarta-bold">
                    {hasProductImages ? "Change Photos" : "Add Images"}
                </Text>
            </Button>

            <ProductImagesModal
                visible={visible}
                images={images}
                onClose={() => setVisible(false)}
                onDeleteImage={handleDeleteImage}
            />
        </View>
    );
}

export default ProductMediaUpload;
