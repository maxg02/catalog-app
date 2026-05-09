import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-nativewind";
import Card from "@/components/ui/card";
import IconCircle from "@/components/ui/iconCircle";
import OptionSelector, { type OptionSelectorOption } from "@/components/ui/optionSelector";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import appConfig from "../../app.json";

type ThemePreference = "light" | "dark" | "system";

const appName = appConfig.expo.name || "the app";

const themeOptions: OptionSelectorOption<ThemePreference>[] = [
    { label: "Light", value: "light", icon: SunIcon },
    { label: "Dark", value: "dark", icon: MoonIcon },
    { label: "System", value: "system", icon: MonitorIcon },
];

function Settings() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [themePreference, setThemePreference] = useState<ThemePreference>(
        colorScheme === "dark" ? "dark" : "system",
    );
    const scrollAmount = useScrollAmount();

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) {
                scrollAmount.value = event.contentOffset.y;
            }
        },
    });

    useEffect(() => {
        if (scrollAmount) {
            scrollAmount.value = 0;
        }

        return () => {
            if (scrollAmount) {
                scrollAmount.value = 0;
            }
        };
    }, [scrollAmount]);

    const handleThemeChange = (value: ThemePreference) => {
        setThemePreference(value);
        setColorScheme(value);
    };

    return (
        <Animated.ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="gap-7 px-6 pb-8"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <Stack.Screen options={{ title: "Settings" }} />

            <View className="gap-4">
                <Text variant={"h4"}>Appearance</Text>
                <Card className="gap-4 px-5 py-5">
                    <View className="flex-row items-center gap-3">
                        <IconCircle icon={MoonIcon} />
                        <View className="flex-1 gap-1">
                            <Text variant={"h3"}>Theme</Text>
                            <Text variant={"muted"} className="text-xs">
                                Choose how {appName} should appear
                            </Text>
                        </View>
                    </View>
                    <OptionSelector
                        options={themeOptions}
                        value={themePreference}
                        onValueChange={handleThemeChange}
                        className="mx-auto"
                    />
                </Card>
            </View>
        </Animated.ScrollView>
    );
}

export default Settings;
