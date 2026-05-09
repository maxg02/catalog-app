import { Text, Pressable } from "react-native";
import React, { useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-nativewind";

interface DateTimeInputProps {
    mode: "date" | "time";
    placeholder?: string;
    initialDate?: Date | null;
}

function DateTimeInput({ mode, placeholder, initialDate = null }: DateTimeInputProps) {
    const [date, setDate] = useState<null | Date>(initialDate);

    const showDateTimePicker = () => {
        DateTimePickerAndroid.open({
            value: date ?? new Date(),
            onChange(event, date) {
                if (event.type === "set" && date) {
                    setDate(date);
                }
            },
            mode: mode,
            is24Hour: true,
        });
    };

    return (
        <Pressable
            onPress={showDateTimePicker}
            className="bg-input border-border h-14 w-full flex-row items-center rounded-2xl border shadow-sm shadow-black/5"
        >
            <CalendarIcon className="w-12 text-muted-foreground" />
            <Text
                className={cn(
                    "flex-1 border-0 bg-transparent px-0 shadow-none",
                    date ? "text-foreground" : "text-muted-foreground",
                )}
            >
                {date
                    ? date.toLocaleString()
                    : placeholder || `Select ${mode === "date" ? "date" : "time"}`}
            </Text>
        </Pressable>
    );
}

export default DateTimeInput;
