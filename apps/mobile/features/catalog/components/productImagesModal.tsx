import React from "react";
import { CameraIcon, ImagesIcon, XIcon } from "lucide-nativewind";
import { Image, Pressable, ScrollView, View } from "react-native";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type ProductImagesModalProps = {
    visible: boolean;
    images: string[];
    mainImageIndex: number | null;
    canAddImages: boolean;
    onClose: () => void;
    onChooseImages: () => void;
    onTakePhoto: () => void;
    onDeleteImage: (index: number) => void;
    onSelectMainImage: (index: number) => void;
};

function ProductImagesModal({
    visible,
    images,
    mainImageIndex,
    canAddImages,
    onClose,
    onChooseImages,
    onTakePhoto,
    onDeleteImage,
    onSelectMainImage,
}: ProductImagesModalProps) {
    const hasImages = images.length > 0;
    const subtitle = `${images.length} ${images.length === 1 ? "photo" : "photos"}`;

    return (
        <Modal
            visible={visible}
            title="Product Photos"
            subtitle={subtitle}
            onClose={onClose}
            footer={
                <View className="flex-row gap-3">
                    <Button
                        className="h-14 flex-1 rounded-full px-4"
                        disabled={!canAddImages}
                        onPress={onTakePhoto}
                    >
                        <CameraIcon size={20} className="text-primary-foreground" />
                        <Text className="font-jakarta-bold">Take Photo</Text>
                    </Button>
                    <Button
                        variant="secondary"
                        className="h-14 flex-1 rounded-full px-4"
                        disabled={!canAddImages}
                        onPress={onChooseImages}
                    >
                        <ImagesIcon size={20} className="text-secondary-foreground" />
                        <Text className="font-jakarta-bold">Choose Photos</Text>
                    </Button>
                </View>
            }
        >
            <ScrollView contentContainerClassName="gap-3" showsVerticalScrollIndicator={false}>
                {hasImages ? (
                    <View className="flex-row flex-wrap gap-3">
                        {images.map((imageUri, index) => {
                            const isMain = mainImageIndex === index;

                            return (
                                <Pressable
                                    key={`${imageUri}-${index}`}
                                    className={cn(
                                        "relative w-[48%] aspect-square overflow-hidden rounded-3xl bg-muted border-2",
                                        isMain ? "border-primary" : "border-transparent",
                                    )}
                                    onPress={() => onSelectMainImage(index)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Set photo ${index + 1} as main`}
                                    accessibilityState={{ selected: isMain }}
                                >
                                    <Image
                                        source={{ uri: imageUri }}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                    />
                                    {isMain && (
                                        <View className="absolute bottom-2 left-2 rounded-full bg-primary px-3 py-1">
                                            <Text className="text-xs font-jakarta-bold text-primary-foreground">
                                                Main
                                            </Text>
                                        </View>
                                    )}
                                    <Button
                                        variant={"destructive"}
                                        size={"icon"}
                                        className="absolute right-2 top-2 h-9 w-9 rounded-full"
                                        onPress={() => onDeleteImage(index)}
                                        accessibilityLabel="Delete photo"
                                    >
                                        <XIcon size={18} className="text-white" />
                                    </Button>
                                </Pressable>
                            );
                        })}
                    </View>
                ) : (
                    <View className="items-center gap-3 rounded-3xl border border-dashed border-border px-6 py-10">
                        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <CameraIcon size={28} className="text-primary" />
                        </View>
                        <Text variant={"muted"} className="text-center">
                            No photos added yet
                        </Text>
                    </View>
                )}
            </ScrollView>
        </Modal>
    );
}

export default ProductImagesModal;
export type { ProductImagesModalProps };
