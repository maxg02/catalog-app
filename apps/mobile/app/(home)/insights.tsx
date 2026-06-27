import React, { useEffect } from "react";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { UserRole } from "@internal/interfaces";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import HeaderContainer from "@/components/layout/headerContainer";
import { StoreIcon } from "lucide-nativewind";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import OverviewCards from "@/features/insights/components/overviewCards";
import ProductHighlight from "@/features/insights/components/productHighlight";
import WeeklyPerformanceCarousel from "@/features/insights/components/weeklyPerformanceCarousel";
import { useGetBusinessInsightsQuery } from "@/features/insights/api/insightsApi";
import { useGetUserInformationQueryState } from "@/features/profile/api/profileApi";
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

    const {
        data: userInformation,
        isLoading: isUserInformationLoading,
        isError: isUserInformationError,
    } = useGetUserInformationQueryState(undefined);
    const {
        data: businessInsights,
        isLoading: isBusinessInsightsLoading,
        isError: isBusinessInsightsError,
    } = useGetBusinessInsightsQuery();

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

    const headerTitle = isUserInformationLoading
        ? "Loading..."
        : isUserInformationError
          ? "Unable to load user information"
          : userInformation?.name;

    if (userInformation?.role === UserRole.Customer) {
        return <Redirect href="/" />;
    }

    const isLoading = isUserInformationLoading || isBusinessInsightsLoading;
    const isError = isUserInformationError || isBusinessInsightsError;

    if (isLoading || isError || !userInformation || !businessInsights) {
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
                                    <Text className="font-jakarta-bold">{headerTitle}</Text>
                                </View>
                            </HeaderContainer>
                        ),
                    }}
                />
                <Card className="px-6 py-5">
                    <Text variant={"muted"}>
                        {isError
                            ? "Unable to load insights from the API."
                            : "Loading insights..."}
                    </Text>
                </Card>
            </Animated.ScrollView>
        );
    }

    const { overview, productHighlights } = businessInsights;
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
                                <Text className="font-jakarta-bold">{headerTitle}</Text>
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
            <OverviewCards overview={overview} />

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
