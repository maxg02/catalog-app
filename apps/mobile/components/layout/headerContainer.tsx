import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

interface HeaderContainerProps {
    children: React.ReactNode;
    scrollAmount?: SharedValue<number>;
}

function HeaderContainer({ children, scrollAmount }: HeaderContainerProps) {
    const shadowStyle = useAnimatedStyle(() => {
        const elevation =
            scrollAmount !== undefined
                ? interpolate(scrollAmount.value, [0, 50], [0, 5], Extrapolation.CLAMP)
                : 0;

        return {
            elevation, // Android
            shadowOpacity: elevation > 0 ? 0.2 : 0, // iOS
        };
    });

    return (
        <Animated.View style={shadowStyle} className="items-center p-4 flex-row gap-4 bg-background">
            {children}
        </Animated.View>
    );
}

export default HeaderContainer;
