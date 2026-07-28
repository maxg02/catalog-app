import React, { useCallback, useEffect } from "react";
import { RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import { Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
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
import { useGetProfileQueryState } from "@/features/profile/api/profileApi";
import { createWeeklyPerformanceDatasets } from "@/features/insights/lib/weeklyMetrics";
import type { RootState } from "@/lib/store";

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
        data: profile,
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useGetProfileQueryState(undefined);
    const businessId = useSelector((state: RootState) => state.businessSelection.selectedBusinessId);
    const business = profile?.businesses.find((item) => item.id === businessId);

    const {
        data: businessInsights,
        isLoading: isBusinessInsightsLoading,
        isFetching: isBusinessInsightsFetching,
        isError: isBusinessInsightsError,
        refetch: refetchBusinessInsights,
    } = useGetBusinessInsightsQuery(businessId ?? 0, { skip: !businessId });

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

    const onRefresh = useCallback(() => {
        if (businessId) refetchBusinessInsights();
    }, [businessId, refetchBusinessInsights]);

    const headerTitle = isProfileLoading
        ? "Loading..."
        : isProfileError
          ? "Unable to load profile"
          : business?.name ?? "No business";

    const isLoading = isProfileLoading || isBusinessInsightsLoading;
    const isError = isProfileError || isBusinessInsightsError;

    if (isLoading || isError || !business || !businessInsights) {
        return (
            <Animated.ScrollView
                contentContainerClassName="px-6 py-4 gap-6"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                className="bg-background flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={Boolean(businessId) && isBusinessInsightsFetching && !isBusinessInsightsLoading}
                        onRefresh={onRefresh}
                    />
                }
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
                            : business
                              ? "Loading insights..."
                              : "Add a business to see insights."}
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
            refreshControl={
                <RefreshControl
                    refreshing={isBusinessInsightsFetching && !isBusinessInsightsLoading}
                    onRefresh={onRefresh}
                />
            }
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
