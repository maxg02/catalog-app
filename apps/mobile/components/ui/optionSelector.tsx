import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type OptionSelectorValue = number | string;

type OptionSelectorOption<TValue extends OptionSelectorValue = OptionSelectorValue> = {
    label: string;
    value: TValue;
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

                return (
                    <Pressable
                        key={String(option.value)}
                        onPress={() => handleSelect(option.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: selected }}
                        className={cn(
                            "rounded-full px-3 py-2",
                            selected ? "bg-primary" : "bg-secondary",
                        )}
                    >
                        <Text
                            className={cn(
                                "text-xs font-jakarta-extrabold uppercase",
                                selected ? "text-primary-foreground" : "text-muted-foreground",
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
