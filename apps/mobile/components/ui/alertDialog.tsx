import React from "react";
import { Modal as NativeModal, Pressable, View } from "react-native";
import { Button, type ButtonProps } from "@/components/ui/button";
import IconCircle from "@/components/ui/iconCircle";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Card from "./card";

type AlertDialogAction = {
    label: string;
    onPress: () => void;
    variant?: ButtonProps["variant"];
    disabled?: boolean;
};

type AlertDialogIcon = React.ComponentType<{ size?: number; className?: string }>;

type AlertDialogProps = {
    visible: boolean;
    title: string;
    description?: string;
    icon?: AlertDialogIcon;
    iconClassName?: string;
    iconContainerClassName?: string;
    primaryAction: AlertDialogAction;
    secondaryAction?: AlertDialogAction;
    onClose: () => void;
};

function AlertDialog({
    visible,
    title,
    description,
    icon,
    iconClassName,
    iconContainerClassName,
    primaryAction,
    secondaryAction,
    onClose,
}: AlertDialogProps) {
    const Icon = icon;

    return (
        <NativeModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 items-center justify-center bg-black/50 px-6">
                <Pressable className="absolute inset-0" onPress={onClose} />
                <Card
                    className="w-full max-w-[360px] gap-4 p-4 shadow-lg"
                    accessibilityRole="alert"
                    accessibilityViewIsModal
                >
                    <View className="flex-row items-center gap-3">
                        {Icon && (
                            <IconCircle
                                icon={Icon}
                                iconSize={17}
                                className={cn("h-8 w-8", iconContainerClassName)}
                                iconClassName={iconClassName}
                            />
                        )}
                        <Text variant="h3" className="flex-1">
                            {title}
                        </Text>
                    </View>

                    {description && (
                        <View className="border-t border-border/60 pt-4">
                            <Text variant="muted">{description}</Text>
                        </View>
                    )}

                    <View className="flex-row gap-2">
                        {secondaryAction && (
                            <Button
                                className="h-12 flex-1 rounded-full"
                                variant={secondaryAction.variant ?? "secondary"}
                                disabled={secondaryAction.disabled}
                                onPress={secondaryAction.onPress}
                            >
                                <Text className="font-jakarta-bold">{secondaryAction.label}</Text>
                            </Button>
                        )}
                        <Button
                            className="h-12 flex-1 rounded-full"
                            variant={primaryAction.variant ?? "default"}
                            disabled={primaryAction.disabled}
                            onPress={primaryAction.onPress}
                        >
                            <Text className="font-jakarta-bold">{primaryAction.label}</Text>
                        </Button>
                    </View>
                </Card>
            </View>
        </NativeModal>
    );
}

export default AlertDialog;
export type { AlertDialogAction, AlertDialogProps };
