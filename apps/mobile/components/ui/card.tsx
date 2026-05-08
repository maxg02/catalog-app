import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<typeof View>) {
    return (
        <View
            className={cn(
                "rounded-3xl overflow-hidden bg-card border border-transparent shadow-sm shadow-black dark:border-border dark:shadow-none",
                className,
            )}
            {...props}
        >
            {props.children}
        </View>
    );
}

export default Card;
