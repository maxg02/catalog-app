import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useColorScheme } from "nativewind";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import { AppThemeProvider } from "@/providers/appThemeProvider";
import ReduxProvider from "@/providers/reduxProvider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
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

function ProfileGate() {
    const {
        isError: isProfileError,
        isLoading: isProfileLoading,
        isSuccess: isProfileSuccess,
        refetch: refetchProfile,
    } = useGetProfileQuery();

    if (isProfileLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
                <ActivityIndicator size="large" />
                <View className="gap-1">
                    <Text variant="h2" className="text-center">
                        Loading profile
                    </Text>
                    <Text variant="muted" className="text-center">
                        Getting your business workspace ready.
                    </Text>
                </View>
            </View>
        );
    }

    if (isProfileError || !isProfileSuccess) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
                <View className="gap-1">
                    <Text variant="h2" className="text-center">
                        Unable to load profile
                    </Text>
                    <Text variant="muted" className="text-center">
                        Check your connection and try again.
                    </Text>
                </View>
                <Button className="h-12 rounded-full px-6" onPress={refetchProfile}>
                    <Text className="font-jakarta-bold">Retry</Text>
                </Button>
            </View>
        );
    }

    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
            <PortalHost name="root-portal" />
        </>
    );
}

export default function AppLayout() {
    const { colorScheme } = useColorScheme();
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
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) return null;

    return (
        <ReduxProvider>
            <AppThemeProvider>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <ProfileGate />
            </AppThemeProvider>
        </ReduxProvider>
    );
}

