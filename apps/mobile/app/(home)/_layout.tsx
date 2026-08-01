import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/components/layout/footer";
import HeaderContainer from "@/components/layout/headerContainer";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";
import { businessHomeTabs } from "@/lib/homeTabs";

export default function HomeLayout() {
    const insightsScrollAmount = useSharedValue(0);
    const catalogScrollAmount = useSharedValue(0);
    const ordersScrollAmount = useSharedValue(0);
    const profileScrollAmount = useSharedValue(0);

    const scrollAmounts: Record<string, SharedValue<number>> = {
        insights: insightsScrollAmount,
        index: catalogScrollAmount,
        orders: ordersScrollAmount,
        profile: profileScrollAmount,
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <ScrollAmountContext.Provider
                value={{
                    defaultValue: insightsScrollAmount,
                    routeValues: scrollAmounts,
                }}
            >
                <Tabs
                    initialRouteName={businessHomeTabs[0].name}
                    tabBar={(props) => <Footer {...props} tabs={businessHomeTabs} />}
                    screenOptions={{
                        header: ({ options, route }) => (
                            <HeaderContainer
                                scrollAmount={scrollAmounts[route.name] ?? insightsScrollAmount}
                            >
                                <View>
                                    <Text variant={"h1"} className="font-jakarta-bold">
                                        {options.title}
                                    </Text>
                                </View>
                            </HeaderContainer>
                        ),
                    }}
                >
                    {businessHomeTabs.map((tab) => (
                        <Tabs.Screen
                            key={tab.name}
                            name={tab.name}
                            options={{
                                title: tab.title,
                            }}
                        />
                    ))}
                    <Tabs.Screen name="orders" options={{ href: null, title: "Orders" }} />
                </Tabs>
            </ScrollAmountContext.Provider>
        </SafeAreaView>
    );
}