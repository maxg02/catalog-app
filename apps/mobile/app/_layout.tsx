import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Switch, View } from "react-native";
import "../global.css";
import { AppThemeProvider } from "@/providers/appThemeProvider";
import { Text } from "@/components/ui/text";
import {
    useFonts,
    PlusJakartaSans_200ExtraLight,
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function ThemeTestingSwitch() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const isDarkMode = colorScheme === "dark";

    return (
        <View className="absolute right-4 top-32 z-50 flex-row items-center gap-2 rounded-full border border-border bg-card/95 px-3 py-2 shadow-sm shadow-black/10">
            <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">Theme</Text>
            <Switch
                value={isDarkMode}
                onValueChange={(enabled) => setColorScheme(enabled ? "dark" : "light")}
                trackColor={{ false: "#e5e7eb", true: "#13a4ec" }}
                thumbColor="#ffffff"
                ios_backgroundColor="#e5e7eb"
                accessibilityLabel="Toggle dark mode"
            />
        </View>
    );
}

export default function AppLayout() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [fontsLoaded, error] = useFonts({
        PlusJakartaSans_200ExtraLight,
        PlusJakartaSans_300Light,
        PlusJakartaSans_400Regular,
        PlusJakartaSans_500Medium,
        PlusJakartaSans_600SemiBold,
        PlusJakartaSans_700Bold,
        PlusJakartaSans_800ExtraBold,
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) {
            SplashScreen.hideAsync();
            //setColorScheme("light");
        }
    }, [fontsLoaded, setColorScheme, error]);

    if (!fontsLoaded && !error) return null;

    return (
        <AppThemeProvider>
            <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
            <ThemeTestingSwitch />
            <PortalHost name="root-portal" />
        </AppThemeProvider>
    );
}
