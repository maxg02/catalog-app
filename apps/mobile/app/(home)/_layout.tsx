import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "@/components/layout/footer";
import HeaderContainer from "@/components/layout/headerContainer";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { ScrollAmountContext } from "@/contexts/scrollAmountContext";
import { businessHomeTabs, customerHomeTabs, homeTabs } from "@/lib/homeTabs";
import { testUser } from "@/lib/utils";

export default function HomeLayout() {
    const discoverScrollAmount = useSharedValue(0);
    const savedScrollAmount = useSharedValue(0);
    const cartsScrollAmount = useSharedValue(0);
    const insightsScrollAmount = useSharedValue(0);
    const catalogScrollAmount = useSharedValue(0);
    const ordersScrollAmount = useSharedValue(0);
    const profileScrollAmount = useSharedValue(0);

    const activeTabs = testUser.role === "business" ? businessHomeTabs : customerHomeTabs;

    const activeRouteNames = activeTabs.map((tab) => tab.name);
    const initialRouteName = activeTabs[0].name;

    const scrollAmounts: Record<string, SharedValue<number>> = {
        index: discoverScrollAmount,
        saved: savedScrollAmount,
        carts: cartsScrollAmount,
        insights: insightsScrollAmount,
        catalog: catalogScrollAmount,
        orders: ordersScrollAmount,
        profile: profileScrollAmount,
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={["left", "right", "top"]}>
            <ScrollAmountContext.Provider
                value={{
                    defaultValue: discoverScrollAmount,
                    routeValues: scrollAmounts,
                }}
            >
                <Tabs
                    initialRouteName={initialRouteName}
                    tabBar={(props) => <Footer {...props} tabs={activeTabs} />}
                    screenOptions={{
                        header: ({ options, route }) => (
                            <HeaderContainer
                                scrollAmount={scrollAmounts[route.name] ?? discoverScrollAmount}
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
                    {homeTabs.map((tab) => (
                        <Tabs.Screen
                            key={tab.name}
                            name={tab.name}
                            options={{
                                title: tab.title,
                                href: activeRouteNames.includes(tab.name) ? undefined : null,
                            }}
                        />
                    ))}
                </Tabs>
            </ScrollAmountContext.Provider>
        </SafeAreaView>
    );
}
