import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "../global.css";
import { AppThemeProvider } from "@/providers/appThemeProvider";
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
            <PortalHost name="root-portal" />
        </AppThemeProvider>
    );
}
