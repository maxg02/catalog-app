import React from "react";
import { View } from "react-native";
import * as DropdownMenuPrimitive from "@/components/primitives/dropdown-menu";
import { Text } from "@/components/ui/text";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DropdownMenuIcon = React.ComponentType<{ size?: number; className?: string }>;

type DropdownMenuAction = {
    key: string;
    label: string;
    icon?: DropdownMenuIcon;
    destructive?: boolean;
    disabled?: boolean;
    onPress: () => void;
};

type DropdownMenuProps = {
    actions: DropdownMenuAction[];
    trigger: React.ReactNode;
    triggerAccessibilityLabel: string;
    disabled?: boolean;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom";
    sideOffset?: number;
    contentClassName?: string;
    triggerClassName?: string;
};

function DropdownMenu({
    actions,
    trigger,
    triggerAccessibilityLabel,
    disabled = false,
    align = "end",
    side = "bottom",
    sideOffset = 8,
    contentClassName,
    triggerClassName,
}: DropdownMenuProps) {
    return (
        <DropdownMenuPrimitive.Root>
            <DropdownMenuPrimitive.Trigger
                className={cn(buttonVariants({ variant: "outline", size: "icon" }), triggerClassName)}
                disabled={disabled}
                accessibilityLabel={triggerAccessibilityLabel}
            >
                {trigger}
            </DropdownMenuPrimitive.Trigger>
            <DropdownMenuPrimitive.Portal hostName="root-portal">
                <DropdownMenuPrimitive.Overlay className="absolute inset-0" />
                <DropdownMenuPrimitive.Content
                    align={align}
                    side={side}
                    sideOffset={sideOffset}
                    className={cn(
                        "min-w-36 overflow-hidden rounded-2xl border border-border bg-background shadow-sm shadow-black/10",
                        contentClassName,
                    )}
                >
                    {actions.map((action, index) => {
                        const Icon = action.icon;
                        const iconClassName = action.destructive ? "text-destructive" : "text-foreground";

                        return (
                            <View key={action.key}>
                                {index > 0 && <DropdownMenuPrimitive.Separator className="h-px bg-border" />}
                                <DropdownMenuPrimitive.Item
                                    className={cn(
                                        "min-h-11 flex-row items-center gap-2 px-3 py-3 active:bg-accent",
                                        action.disabled && "opacity-50",
                                    )}
                                    disabled={action.disabled}
                                    textValue={action.label}
                                    onPress={action.onPress}
                                >
                                    {Icon && <Icon size={18} className={iconClassName} />}
                                    <Text
                                        className={cn(
                                            "font-jakarta-bold",
                                            action.destructive && "text-destructive",
                                        )}
                                    >
                                        {action.label}
                                    </Text>
                                </DropdownMenuPrimitive.Item>
                            </View>
                        );
                    })}
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Root>
    );
}

export default DropdownMenu;
export type { DropdownMenuAction, DropdownMenuProps };

