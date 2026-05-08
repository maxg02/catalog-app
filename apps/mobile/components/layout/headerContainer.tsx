import React from "react";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";

interface HeaderContainerProps {
    children: React.ReactNode;
    scrollAmount?: SharedValue<number> | null;
}

function HeaderContainer({ children, scrollAmount }: HeaderContainerProps) {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";
    const shadowStyle = useAnimatedStyle(() => {
        const scrollElevation =
            scrollAmount !== undefined && scrollAmount !== null
                ? interpolate(scrollAmount.value, [0, 50], [0, 5], Extrapolation.CLAMP)
                : 0;
        const borderBottomWidth =
            scrollAmount !== undefined && scrollAmount !== null
                ? interpolate(scrollAmount.value, [0, 50], [0, 1], Extrapolation.CLAMP)
                : 0;

        return {
            elevation: isDarkMode ? 0 : scrollElevation,
            shadowOpacity: !isDarkMode && scrollElevation > 0 ? 0.2 : 0,
            borderBottomWidth: isDarkMode ? borderBottomWidth : 0,
        };
    });

    return (
        <Animated.View
            style={shadowStyle}
            className="items-center py-4 px-6 flex-row gap-4 bg-background border-border"
        >
            {children}
        </Animated.View>
    );
}

export default HeaderContainer;
