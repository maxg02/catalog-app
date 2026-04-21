import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/components/layout/footer";
import HeaderContainer from "@/components/layout/headerContainer";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";

export default function RootLayout() {
    const scrollAmount = useSharedValue(0);

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <ScrollAmountContext.Provider value={scrollAmount}>
                <Stack
                    screenOptions={{
                        header: ({ options }) => (
                            <HeaderContainer scrollAmount={scrollAmount}>
                                <View>
                                    <Text variant={"h1"} className="font-jakarta-bold">
                                        {options.title}
                                    </Text>
                                </View>
                            </HeaderContainer>
                        ),
                    }}
                />
            </ScrollAmountContext.Provider>
            <Footer />
        </SafeAreaView>
    );
}
