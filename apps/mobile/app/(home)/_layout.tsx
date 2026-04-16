import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/components/layout/footer";
import HeaderContainer from "@/components/layout/headerContainer";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { CircleArrowLeftIcon, Share2Icon } from "lucide-nativewind";

export default function RootLayout() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <Stack
                screenOptions={{
                    header: ({ options }) => (
                        <HeaderContainer>
                            <View>
                                <Text className="font-jakarta-bold">{options.title}</Text>
                            </View>
                            <Share2Icon className="ml-auto text-primary" />
                        </HeaderContainer>
                    ),
                }}
            />
            <Footer />
        </SafeAreaView>
    );
}
