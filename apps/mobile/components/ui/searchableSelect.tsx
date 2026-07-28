import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, View } from "react-native";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, SearchIcon } from "lucide-nativewind";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SearchableSelectOption = {
    label: string;
    value: string;
    imageUri?: string | null;
};

type SearchableSelectProps = React.ComponentProps<typeof View> & {
    options: SearchableSelectOption[];
    disabled?: boolean;
    emptyMessage?: string;
    placeholder?: string;
    searchPlaceholder?: string;
    value?: string | null;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
};

function SearchableSelect({
    options,
    disabled = false,
    emptyMessage = "No options found",
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    value,
    defaultValue,
    onValueChange,
    className,
    ...props
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const selectedValue = value ?? internalValue;
    const selectedOption = options.find((option) => option.value === selectedValue);
    const filteredOptions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return options;
        }

        return options.filter((option) => option.label.toLowerCase().includes(normalizedQuery));
    }, [options, query]);

    const handleSelect = (optionValue: string) => {
        setInternalValue(optionValue);
        onValueChange?.(optionValue);
        setOpen(false);
        setQuery("");
    };

    return (
        <View className={cn("relative", className)} {...props}>
            <Pressable
                accessibilityRole="button"
                accessibilityState={{ expanded: open }}
                className={cn(
                    "border-border bg-input h-14 flex-row items-center justify-between rounded-2xl border px-4 shadow-sm shadow-black/5",
                    disabled && "opacity-50",
                )}
                disabled={disabled}
                onPress={() => setOpen((currentOpen) => !currentOpen)}
            >
                <View className="flex-1 flex-row items-center gap-3">
                    {selectedOption?.imageUri !== undefined &&
                        (selectedOption.imageUri ? (
                            <Image
                                source={{ uri: selectedOption.imageUri }}
                                className="h-10 w-14 rounded-xl"
                                resizeMode="cover"
                                accessibilityLabel={selectedOption.label + " banner"}
                            />
                        ) : (
                            <View className="h-10 w-14 rounded-xl bg-muted" />
                        ))}
                    <Text
                        numberOfLines={1}
                        className={selectedOption ? "flex-1 text-foreground" : "flex-1 text-muted-foreground"}
                    >
                        {selectedOption?.label ?? placeholder}
                    </Text>
                </View>
                {open ? (
                    <ChevronUpIcon size={18} className="text-muted-foreground" />
                ) : (
                    <ChevronDownIcon size={18} className="text-muted-foreground" />
                )}
            </Pressable>

            {open && (
                <View className="border-border bg-card mt-2 gap-2 rounded-2xl border p-2 shadow-lg shadow-black/10">
                    <View className="border-border bg-input h-12 flex-row items-center rounded-xl border px-3">
                        <SearchIcon size={18} className="mr-2 text-muted-foreground" />
                        <Input
                            value={query}
                            onChangeText={setQuery}
                            placeholder={searchPlaceholder}
                            className="h-full flex-1 border-0 bg-transparent px-0 shadow-none"
                            autoCapitalize="none"
                        />
                    </View>

                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        nestedScrollEnabled
                        style={{ maxHeight: 256 }}
                    >
                        <View className="gap-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => {
                                    const selected = option.value === selectedValue;

                                    return (
                                        <Pressable
                                            key={option.value}
                                            accessibilityRole="button"
                                            accessibilityState={{ selected }}
                                            className="flex-row items-center justify-between rounded-xl px-3 py-3 active:bg-secondary"
                                            onPress={() => handleSelect(option.value)}
                                        >
                                            <View className="flex-1 flex-row items-center gap-3">
                                                {option.imageUri !== undefined &&
                                                    (option.imageUri ? (
                                                        <Image
                                                            source={{ uri: option.imageUri }}
                                                            className="h-12 w-16 rounded-xl"
                                                            resizeMode="cover"
                                                            accessibilityLabel={option.label + " banner"}
                                                        />
                                                    ) : (
                                                        <View className="h-12 w-16 rounded-xl bg-muted" />
                                                    ))}
                                                <Text numberOfLines={1} className="flex-1">
                                                    {option.label}
                                                </Text>
                                            </View>
                                            {selected && <CheckIcon size={18} className="text-primary" />}
                                        </Pressable>
                                    );
                                })
                            ) : (
                                <View className="px-3 py-4">
                                    <Text variant={"muted"} className="text-center text-xs">
                                        {emptyMessage}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

export default SearchableSelect;
export type { SearchableSelectOption, SearchableSelectProps };
