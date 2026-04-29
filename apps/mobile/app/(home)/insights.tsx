import React, { useEffect } from "react";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import HeaderContainer from "@/components/layout/headerContainer";
import {
    BellIcon,
    ChartNoAxesCombinedIcon,
    EyeIcon,
    PackageSearchIcon,
    ReceiptTextIcon,
    ShoppingCartIcon,
    StoreIcon,
} from "lucide-nativewind";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { testUser } from "@/lib/utils";
import { CartesianChart, Line } from "victory-native";

function Insights() {
    const scrollAmount = useScrollAmount("insights");
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

    if (testUser.rol === "customer") {
        return <Redirect href="/" />;
    }

    const weekday = new Date().getDay() - 1;

    const testData = [
        { name: "Mon", value: 120 },
        { name: "Tue", value: 200 },
        { name: "Wed", value: 150 },
        { name: "Thu", value: 80 },
        { name: "Fri", value: 70 },
        { name: "Sat", value: 110 },
        { name: "Sun", value: 130 },
    ];

    return (
        <Animated.ScrollView
            contentContainerClassName="px-6 py-4 gap-6"
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="bg-background flex-1"
        >
            <Tabs.Screen
                options={{
                    header: () => (
                        <HeaderContainer scrollAmount={scrollAmount}>
                            <StoreIcon className="text-primary" />
                            <View>
                                <Text className="text-xs text-muted-foreground font-jakarta-semibold">
                                    Analytics Dashboard
                                </Text>
                                <Text className="font-jakarta-bold">{testUser.name}</Text>
                            </View>
                            <BellIcon className="ml-auto" />
                        </HeaderContainer>
                    ),
                }}
            />
            <View className="flex flex-row items-center justify-between">
                <Text variant={"h1"}>Overview</Text>
                <Badge variant={"muted"}>
                    <Text>Last 24h</Text>
                </Badge>
            </View>
            <View className="flex-row gap-3 flex-wrap">
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between">
                        <Text variant={"muted"}>Carts Created</Text>
                        <ShoppingCartIcon className="text-primary" />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        845
                    </Text>
                    <Text className="text-xs text-destructive mt-2">-31%</Text>
                </Card>
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between">
                        <Text variant={"muted"}>Orders Placed</Text>
                        <ReceiptTextIcon className="text-primary" />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        934
                    </Text>
                    <Text className="text-xs text-destructive mt-2">-11%</Text>
                </Card>
                <Card className="basis-full py-4 px-6">
                    <View className="flex-row justify-between">
                        <Text variant={"muted"}>Catalog Visits</Text>
                        <PackageSearchIcon className="text-primary" />
                    </View>
                    <View className="flex-row items-center justify-between">
                        <Text variant={"h1"} className="text-start mt-2">
                            1285
                        </Text>
                        <Text className="text-xs text-primary mt-2">+12.5%</Text>
                    </View>
                </Card>
            </View>
            <Card className="px-6 py-4">
                <View className="flex-row justify-between">
                    <Text variant={"h2"}>Weekly Performance</Text>
                    <ChartNoAxesCombinedIcon className="text-primary" />
                </View>
                {/* <CartesianChart data={testData} xKey="name" yKeys={["value"]}>
                    {({ points }) => <Line points={points.value} color="red" strokeWidth={3} />}
                </CartesianChart> */}
            </Card>
        </Animated.ScrollView>
    );
}

export default Insights;
