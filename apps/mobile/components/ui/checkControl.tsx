import React from "react";
import { CheckIcon } from "lucide-nativewind";
import { View } from "react-native";
import { cn } from "@/lib/utils";

type CheckControlProps = {
    checked: boolean;
};

function CheckControl({ checked }: CheckControlProps) {
    return (
        <View
            className={cn(
                "h-5 w-5 items-center justify-center rounded border",
                checked ? "border-primary bg-primary" : "border-border bg-card",
            )}
        >
            {checked && <CheckIcon size={14} className="text-primary-foreground" />}
        </View>
    );
}

export default CheckControl;
export type { CheckControlProps };
