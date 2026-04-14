import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/components/layout/footer";

export default function RootLayout() {
    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <Stack />
            <Footer />
        </SafeAreaView>
    );
}
