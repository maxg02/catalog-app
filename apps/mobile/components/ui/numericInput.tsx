import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Input } from "./input";
import { MinusIcon, PlusIcon } from "lucide-nativewind";

function NumericInput() {
    const [value, setValue] = useState<number>(0);

    //Create an onChange handler that only allows numeric input and updates the value state
    const handleChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, "");
        setValue(Number(numericValue));
    };

    return (
        <View className="flex-row bg-input p-1 gap-2 items-center rounded-2xl h-12 min-w-40 flex-1">
            <Pressable
                onPress={() => handleChange((value - 1).toString())}
                className="rounded-2xl bg-card h-full aspect-square items-center justify-center"
            >
                <MinusIcon className="text-primary" />
            </Pressable>
            <Input
                keyboardType="numeric"
                inputMode="numeric"
                className="flex-1 text-center"
                defaultValue="0"
                value={value.toString()}
                onChangeText={handleChange}
            />
            <Pressable
                onPress={() => handleChange((value + 1).toString())}
                className="rounded-2xl bg-card h-full aspect-square items-center justify-center"
            >
                <PlusIcon className="text-primary" />
            </Pressable>
        </View>
    );
}

export default NumericInput;
