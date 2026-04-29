import React, { useEffect, useRef, useState } from "react";
import { Image, LayoutChangeEvent, ScrollView, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import HeaderContainer from "@/components/layout/headerContainer";
import {
    BellIcon,
    ChartNoAxesCombinedIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    PackageSearchIcon,
    ReceiptTextIcon,
    ShoppingCartIcon,
    StoreIcon,
} from "lucide-nativewind";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import { testProducts, testUser } from "@/lib/utils";
import WeeklyPerformanceChart from "@/features/insights/components/weeklyPerformanceChart";

const chartDatasets = [
    {
        label: "Orders Placed",
        data: [
            { name: "Mon", value: 132 },
            { name: "Tue", value: 148 },
            { name: "Wed", value: 121 },
            { name: "Thu", value: 164 },
            { name: "Fri", value: 188 },
            { name: "Sat", value: 109 },
            { name: "Sun", value: 72 },
        ],
    },
    {
        label: "Catalog Visits",
        data: [
            { name: "Mon", value: 184 },
            { name: "Tue", value: 211 },
            { name: "Wed", value: 236 },
            { name: "Thu", value: 168 },
            { name: "Fri", value: 256 },
            { name: "Sat", value: 148 },
            { name: "Sun", value: 82 },
        ],
    },
    {
        label: "Carts Created",
        data: [
            { name: "Mon", value: 120 },
            { name: "Tue", value: 200 },
            { name: "Wed", value: 150 },
            { name: "Thu", value: 80 },
            { name: "Fri", value: 70 },
            { name: "Sat", value: 110 },
            { name: "Sun", value: 130 },
        ],
    },
];

const productHighlights = [
    {
        label: "Most Saved",
        metric: "428 saves",
        icon: HeartIcon,
        product: testProducts[1],
    },
    {
        label: "Most Ordered",
        metric: "316 orders",
        icon: ReceiptTextIcon,
        product: testProducts[3],
    },
];

function Insights() {
    const [selectedChartIndex, setSelectedChartIndex] = useState(0);
    const [metricCarouselWidth, setMetricCarouselWidth] = useState(0);
    const metricCarouselRef = useRef<ScrollView>(null);
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

    useEffect(() => {
        if (metricCarouselWidth === 0) {
            return;
        }

        metricCarouselRef.current?.scrollTo({
            x: selectedChartIndex * metricCarouselWidth,
            animated: true,
        });
    }, [metricCarouselWidth, selectedChartIndex]);

    if (testUser.rol === "customer") {
        return <Redirect href="/" />;
    }

    const cartsCreated = 845;
    const ordersPlaced = 934;
    const catalogVisits = 1285;
    const catalogToOrderRate = (ordersPlaced / catalogVisits) * 100;
    const selectedDataset = chartDatasets[selectedChartIndex];

    const showPreviousDataset = () => {
        setSelectedChartIndex((currentIndex) =>
            currentIndex === 0 ? chartDatasets.length - 1 : currentIndex - 1,
        );
    };

    const showNextDataset = () => {
        setSelectedChartIndex((currentIndex) =>
            currentIndex === chartDatasets.length - 1 ? 0 : currentIndex + 1,
        );
    };

    const handleMetricCarouselLayout = (event: LayoutChangeEvent) => {
        setMetricCarouselWidth(event.nativeEvent.layout.width);
    };

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
                        {cartsCreated}
                    </Text>
                    <Text className="text-xs text-destructive mt-2">-31% vs yesterday</Text>
                </Card>
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between">
                        <Text variant={"muted"}>Orders Placed</Text>
                        <ReceiptTextIcon className="text-primary" />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        {ordersPlaced}
                    </Text>
                    <Text className="text-xs text-destructive mt-2">-11% vs yesterday</Text>
                </Card>
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between">
                        <Text variant={"muted"} numberOfLines={1}>
                            Catalog Visits
                        </Text>
                        <PackageSearchIcon className="text-primary" />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        {catalogVisits}
                    </Text>
                    <Text className="text-xs text-primary mt-2">+12.5% vs yesterday</Text>
                </Card>
                <Card className="flex-1 py-4 px-6">
                    <View className="flex-row justify-between">
                        <Text variant={"muted"} numberOfLines={1}>
                            Conversion Funnel
                        </Text>
                        <ChartNoAxesCombinedIcon className="text-primary" />
                    </View>
                    <Text variant={"h1"} className="text-start mt-2">
                        {catalogToOrderRate.toFixed(1)}%
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-2" numberOfLines={1}>
                        {ordersPlaced} orders from {catalogVisits} visits
                    </Text>
                </Card>
            </View>
            <View className="flex-row items-center justify-between">
                <Text variant={"h1"}>Weekly Performance</Text>
                <ChartNoAxesCombinedIcon className="text-primary" />
            </View>
            <Card className="px-6 py-4">
                <View className="h-64">
                    <WeeklyPerformanceChart data={selectedDataset.data} />
                </View>
                <View className="mt-4 flex-row items-center gap-3">
                    <Button
                        size={"icon"}
                        variant={"outline"}
                        onPress={showPreviousDataset}
                        accessibilityLabel="Show previous chart metric"
                    >
                        <ChevronLeftIcon size={20} className="text-foreground" />
                    </Button>
                    <ScrollView
                        ref={metricCarouselRef}
                        horizontal
                        pagingEnabled
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}
                        className="flex-1"
                        onLayout={handleMetricCarouselLayout}
                    >
                        {chartDatasets.map((dataset) => (
                            <View
                                key={dataset.label}
                                style={{ width: metricCarouselWidth }}
                                className="items-center justify-center px-2"
                            >
                                <View className="w-full rounded-full bg-primary px-4 py-2">
                                    <Text className="text-center text-xs font-jakarta-bold text-primary-foreground">
                                        {dataset.label}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <Button
                        size={"icon"}
                        variant={"outline"}
                        onPress={showNextDataset}
                        accessibilityLabel="Show next chart metric"
                    >
                        <ChevronRightIcon size={20} className="text-foreground" />
                    </Button>
                </View>
            </Card>
            <View className="flex-row items-center justify-between">
                <Text variant={"h1"}>Product Highlights</Text>
                <PackageSearchIcon className="text-primary" />
            </View>
            <Card className="px-6 py-4">
                <View className="gap-6">
                    {productHighlights.map(({ label, metric, icon: Icon, product }) => {
                        const price = product.sale ? product.salePrice : product.price;

                        return (
                            <View key={label} className="flex-row items-center gap-3">
                                <View className="h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                                    <Image
                                        source={{ uri: product.image[0] }}
                                        className="h-full w-full"
                                        resizeMode="cover"
                                    />
                                </View>
                                <View className="flex-1 gap-1">
                                    <View className="flex-row items-center gap-2">
                                        <Icon size={16} className="text-primary" />
                                        <Text className="text-xs font-jakarta-bold text-primary">
                                            {label}
                                        </Text>
                                    </View>
                                    <Text variant={"h2"} numberOfLines={1} className="font-jakarta-bold">
                                        {product.name}
                                    </Text>
                                    <Text className="font-jakarta-bold text-primary">
                                        ${price?.toFixed(2)}
                                    </Text>
                                </View>
                                <Badge variant={"muted"}>
                                    <Text className="text-xs">{metric}</Text>
                                </Badge>
                            </View>
                        );
                    })}
                </View>
            </Card>
        </Animated.ScrollView>
    );
}

export default Insights;
