import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";

type IconCircleProps = React.ComponentProps<typeof View> & {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconSize?: number;
    iconClassName?: string;
};

function IconCircle({
    icon: Icon,
    iconSize = 18,
    iconClassName,
    className,
    ...props
}: IconCircleProps) {
    return (
        <View
            className={cn(
                "h-9 w-9 items-center justify-center rounded-full bg-primary/10",
                className,
            )}
            {...props}
        >
            <Icon size={iconSize} className={cn("text-primary", iconClassName)} />
        </View>
    );
}

export default IconCircle;
export type { IconCircleProps };
