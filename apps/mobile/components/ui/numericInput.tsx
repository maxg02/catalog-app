import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Input } from "./input";
import { MinusIcon, PlusIcon } from "lucide-nativewind";
import { cn } from "@/lib/utils";

interface NumericInputProps {
    value?: number;
    className?: string;
}

function NumericInput({ value, className = "" }: NumericInputProps) {
    const [stateValue, setValue] = useState<number>(value || 0);

    //Create an onChange handler that only allows numeric input and updates the value state
    const handleChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        setValue(Number(numericValue));
    };

    return (
        <View
            className={cn(
                "flex-row bg-input p-1 gap-2 items-center rounded-2xl h-12 min-w-0 w-full",
                className,
            )}
        >
            <Pressable
                onPress={() => handleChange((stateValue - 1).toString())}
                className="rounded-2xl bg-card h-full aspect-square items-center justify-center"
            >
                <MinusIcon className="text-primary" />
            </Pressable>
            <Input
                keyboardType="numeric"
                inputMode="numeric"
                className="flex-1 text-center px-0"
                defaultValue="0"
                value={stateValue.toString()}
                onChangeText={handleChange}
            />
            <Pressable
                onPress={() => handleChange((stateValue + 1).toString())}
                className="rounded-2xl bg-card h-full aspect-square items-center justify-center"
            >
                <PlusIcon className="text-primary" />
            </Pressable>
        </View>
    );
}

export default NumericInput;
