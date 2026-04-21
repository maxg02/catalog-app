import React from "react";
import Animated, {
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

interface HeaderContainerProps {
    children: React.ReactNode;
    scrollAmount?: SharedValue<number> | null;
}

function HeaderContainer({ children, scrollAmount }: HeaderContainerProps) {
    const shadowStyle = useAnimatedStyle(() => {
        const elevation =
            scrollAmount !== undefined && scrollAmount !== null
                ? interpolate(scrollAmount.value, [0, 50], [0, 5], Extrapolation.CLAMP)
                : 0;

        return {
            elevation, // Android
            shadowOpacity: elevation > 0 ? 0.2 : 0, // iOS
        };
    });

    return (
        <Animated.View
            style={shadowStyle}
            className="items-center py-4 px-6 flex-row gap-4 bg-background"
        >
            {children}
        </Animated.View>
    );
}

export default HeaderContainer;
