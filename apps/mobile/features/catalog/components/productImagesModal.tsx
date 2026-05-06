import React from "react";
import { CameraIcon, PlusIcon, XIcon } from "lucide-nativewind";
import { Image, ScrollView, View } from "react-native";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type ProductImagesModalProps = {
    visible: boolean;
    images: string[];
    onClose: () => void;
    onDeleteImage: (index: number) => void;
};

function ProductImagesModal({ visible, images, onClose, onDeleteImage }: ProductImagesModalProps) {
    const hasImages = images.length > 0;
    const subtitle = `${images.length} ${images.length === 1 ? "photo" : "photos"}`;

    return (
        <Modal
            visible={visible}
            title="Product Photos"
            subtitle={subtitle}
            onClose={onClose}
            footer={
                <Button className="h-14 rounded-full">
                    <PlusIcon size={20} className="text-primary-foreground" />
                    <Text className="font-jakarta-bold">Add More Photos</Text>
                </Button>
            }
        >
            <ScrollView contentContainerClassName="gap-3" showsVerticalScrollIndicator={false}>
                {hasImages ? (
                    <View className="flex-row flex-wrap gap-3">
                        {images.map((imageUri, index) => (
                            <View
                                key={`${imageUri}-${index}`}
                                className="relative w-[48%] aspect-square rounded-3xl bg-muted"
                            >
                                <Image
                                    source={{ uri: imageUri }}
                                    className="h-full w-full rounded-3xl"
                                    resizeMode="cover"
                                />
                                <Button
                                    variant={"destructive"}
                                    size={"icon"}
                                    className="absolute right-2 top-2 h-9 w-9 rounded-full"
                                    onPress={() => onDeleteImage(index)}
                                    accessibilityLabel="Delete photo"
                                >
                                    <XIcon size={18} className="text-white" />
                                </Button>
                            </View>
                        ))}
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
