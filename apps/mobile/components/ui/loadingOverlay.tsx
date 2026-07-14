import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type LoadingOverlayProps = React.ComponentProps<typeof View> & {
    label: string;
};

function LoadingOverlay({ label, className, ...props }: LoadingOverlayProps) {
    return (
        <View
            className={cn("absolute inset-0 items-center justify-center bg-black/70", className)}
            {...props}
        >
            <ActivityIndicator size="large" color="white" />
            <Text className="mt-3 font-jakarta-bold text-white">{label}</Text>
        </View>
    );
}

export default LoadingOverlay;
export type { LoadingOverlayProps };
