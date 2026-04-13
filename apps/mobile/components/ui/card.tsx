import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

function Card({ ...props }: React.ComponentProps<typeof View>) {
    return (
        <View
            className={cn(
                "border border-transparent rounded-3xl overflow-hidden bg-card shadow-black shadow-sm",
                props.className,
            )}
        >
            {props.children}
        </View>
    );
}

export default Card;
