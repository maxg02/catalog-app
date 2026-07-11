import { Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-nativewind";

interface DateTimeInputProps {
    mode: "date" | "time";
    placeholder?: string;
    initialDate?: Date | null;
    value?: Date | null;
    onDateChange?: (date: Date | null) => void;
}

function DateTimeInput({
    mode,
    placeholder,
    initialDate = null,
    value,
    onDateChange,
}: DateTimeInputProps) {
    const [internalDate, setInternalDate] = useState<null | Date>(initialDate);
    const date = value !== undefined ? value : internalDate;

    useEffect(() => {
        if (value === undefined) {
            setInternalDate(initialDate);
        }
    }, [initialDate, value]);

    const setDate = (nextDate: Date) => {
        if (value === undefined) {
            setInternalDate(nextDate);
        }

        onDateChange?.(nextDate);
    };

    const showDateTimePicker = () => {
        DateTimePickerAndroid.open({
            value: date ?? new Date(),
            onChange(event, nextDate) {
                if (event.type === "set" && nextDate) {
                    setDate(nextDate);
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