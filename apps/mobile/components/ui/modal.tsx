import React from "react";
import { XIcon } from "lucide-nativewind";
import { Modal as NativeModal, Pressable, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

type ModalProps = {
    visible: boolean;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    onClose: () => void;
};

function Modal({ visible, title, subtitle, children, footer, onClose }: ModalProps) {
    return (
        <NativeModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 justify-end bg-black/50">
                <Pressable className="flex-1" onPress={onClose} />
                <View className="max-h-[82%] gap-5 rounded-t-3xl bg-background px-6 pb-8 pt-5">
                    <View className="flex-row items-center gap-3">
                        <View className="flex-1">
                            <Text variant={"h1"} className="text-left">
                                {title}
                            </Text>
                            {subtitle && (
                                <Text variant={"muted"} className="text-xs">
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onPress={onClose}
                            accessibilityLabel="Close modal"
                        >
                            <XIcon size={24} className="text-foreground" />
                        </Button>
                    </View>

                    {children}

                    {footer}
                </View>
            </View>
        </NativeModal>
    );
}

export default Modal;
export type { ModalProps };
