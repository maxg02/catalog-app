import React, { useEffect } from "react";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import HeaderContainer from "@/components/layout/headerContainer";
import {
    PackageSearchIcon,
    ReceiptTextIcon,
    ShoppingCartIcon,
    StoreIcon,
    TrendingUpIcon,
} from "lucide-nativewind";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import { testUser } from "@/lib/utils";
import ProductHighlight from "@/features/insights/components/productHighlight";
import WeeklyPerformanceCarousel from "@/features/insights/components/weeklyPerformanceCarousel";
import { formatTrend } from "@/features/insights/lib/insightMetrics";
import { createWeeklyPerformanceDatasets } from "@/features/insights/lib/weeklyMetrics";

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

    if (testUser.role === "customer") {
        return <Redirect href="/" />;
    }

    const { overview, productHighlights } = testUser.insights;
    const cartsCreated = overview.cartsCreated.total;
    const ordersPlaced = overview.ordersPlaced.total;
    const catalogVisits = overview.catalogVisits.total;
    const catalogToOrderRate = (ordersPlaced / catalogVisits) * 100;

    const chartDatasets = createWeeklyPerformanceDatasets(overview);

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
            <View className="gap-3 flex-row flex-wrap sm:gap-y-0">
                <Card className="py-4 px-6 w-full sm:flex-1 sm:w-auto">
                    <View className="flex-row justify-between items-center">
                        <Text variant={"muted"} numberOfLines={1}>
                            Conversion Funnel
                        </Text>
                        <TrendingUpIcon className="text-primary" size={20} />
                    </View>
                    <View className="flex-row items-center justify-between sm:flex-col sm:items-start">
                        <Text variant={"h1"} className="text-start mt-2">
                            {catalogToOrderRate.toFixed(1)}%
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-2" numberOfLines={1}>
                            {ordersPlaced} orders from {catalogVisits} visits
                        </Text>
                    </View>
                </Card>
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between items-center">
                        <Text variant={"muted"} numberOfLines={1}>
                            Catalog Visits
                        </Text>
                        <PackageSearchIcon className="text-primary" size={20} />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        {catalogVisits}
                    </Text>
                    <Text className="text-xs text-primary mt-2">
                        {formatTrend(catalogVisits, overview.catalogVisits.previousTotal)}
                    </Text>
                </Card>
                <View className="max-sm:hidden w-full h-3"></View>
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between items-center">
                        <Text variant={"muted"}>Orders Placed</Text>
                        <ReceiptTextIcon className="text-primary" size={20} />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        {ordersPlaced}
                    </Text>
                    <Text className="text-xs text-destructive mt-2">
                        {formatTrend(ordersPlaced, overview.ordersPlaced.previousTotal)}
                    </Text>
                </Card>
                <Card className="py-4 px-6 w-full sm:flex-1 sm:w-auto">
                    <View className="flex-row justify-between items-center">
                        <Text variant={"muted"}>Carts Created</Text>
                        <ShoppingCartIcon className="text-primary" size={20} />
                    </View>
                    <View className="flex-row items-center justify-between sm:flex-col sm:items-start">
                        <Text variant={"h1"} className="text-start mt-2">
                            {cartsCreated}
                        </Text>
                        <Text className="text-xs text-destructive mt-2">
                            {formatTrend(cartsCreated, overview.cartsCreated.previousTotal)}
                        </Text>
                    </View>
                </Card>
            </View>

            <Text variant={"h1"} className="text-start">
                Weekly Performance
            </Text>
            <Card className="px-6 py-4">
                <WeeklyPerformanceCarousel datasets={chartDatasets} />
            </Card>

            <Text variant={"h1"} className="text-start">
                Product Highlights
            </Text>
            <Card className="px-6 py-4">
                <View className="gap-6">
                    {productHighlights.map((highlight) => (
                        <ProductHighlight key={highlight.label} highlight={highlight} />
                    ))}
                </View>
            </Card>
        </Animated.ScrollView>
    );
}

export default Insights;
