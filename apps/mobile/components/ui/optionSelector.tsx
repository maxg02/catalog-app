import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type OptionSelectorValue = number | string;

type OptionSelectorOption<TValue extends OptionSelectorValue = OptionSelectorValue> = {
    label: string;
    value: TValue;
    icon?: React.ComponentType<{ size?: number; className?: string }>;
};

type OptionSelectorProps<TValue extends OptionSelectorValue = OptionSelectorValue> =
    React.ComponentProps<typeof View> & {
        options: OptionSelectorOption<TValue>[];
        initialValue?: TValue;
        value?: TValue;
        onValueChange?: (value: TValue) => void;
    };

function OptionSelector<TValue extends OptionSelectorValue = OptionSelectorValue>({
    options,
    initialValue,
    value,
    onValueChange,
    className,
    ...props
}: OptionSelectorProps<TValue>) {
    const [internalValue, setInternalValue] = useState<TValue | undefined>(
        initialValue ?? options[0]?.value,
    );
    const selectedValue = value ?? internalValue;

    const handleSelect = (optionValue: TValue) => {
        setInternalValue(optionValue);
        onValueChange?.(optionValue);
    };

    return (
        <View className={cn("flex-row flex-wrap gap-2", className)} {...props}>
            {options.map((option) => {
                const selected = selectedValue === option.value;
                const Icon = option.icon;
                const contentClassName = selected ? "text-primary-foreground" : "text-muted-foreground";

                return (
                    <Pressable
                        key={String(option.value)}
                        onPress={() => handleSelect(option.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        className={cn(
                            "flex-row items-center gap-2 rounded-full px-3 py-2",
                            selected ? "bg-primary" : "bg-secondary",
                        )}
                    >
                        {Icon && <Icon size={14} className={contentClassName} />}
                        <Text
                            className={cn(
                                "text-xs font-jakarta-extrabold uppercase",
                                contentClassName,
                            )}
                        >
                            {option.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

export default OptionSelector;
export type { OptionSelectorOption, OptionSelectorProps, OptionSelectorValue };
