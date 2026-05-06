import React from "react";
import { type TextInput, type TextInputProps, View } from "react-native";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type IconInputProps = TextInputProps &
    React.RefAttributes<TextInput> & {
        icon: React.ComponentType<{ size?: number; className?: string }>;
        iconSize?: number;
        inputClassName?: string;
    };

function IconInput({
    icon: Icon,
    iconSize = 20,
    className,
    inputClassName,
    ...props
}: IconInputProps) {
    return (
        <View
            className={cn(
                "bg-input border-border h-14 w-full flex-row items-center rounded-2xl border shadow-sm shadow-black/5",
                props.editable === false && "opacity-50",
                className,
            )}
        >
            <Icon size={iconSize} className="w-12 text-muted-foreground" />
            <Input className={cn("flex-1 border-0 bg-transparent px-0 shadow-none", inputClassName)} {...props} />
        </View>
    );
}

export { IconInput };
export type { IconInputProps };
