import React, { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, ScrollView, View } from "react-native";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import type { WeeklyPerformanceDataset } from "@/features/insights/lib/weeklyMetrics";
import WeeklyPerformanceChart from "@/features/insights/components/weeklyPerformanceChart";

type WeeklyPerformanceCarouselProps = {
    datasets: WeeklyPerformanceDataset[];
};

function WeeklyPerformanceCarousel({ datasets }: WeeklyPerformanceCarouselProps) {
    const [selectedChartIndex, setSelectedChartIndex] = useState(0);
    const [metricCarouselWidth, setMetricCarouselWidth] = useState(0);
    const metricCarouselRef = useRef<ScrollView>(null);
    const selectedDataset = datasets[selectedChartIndex];

    useEffect(() => {
        if (metricCarouselWidth === 0) {
            return;
        }

        metricCarouselRef.current?.scrollTo({
            x: selectedChartIndex * metricCarouselWidth,
            animated: true,
        });
    }, [metricCarouselWidth, selectedChartIndex]);

    const showPreviousDataset = () => {
        setSelectedChartIndex((currentIndex) =>
            currentIndex === 0 ? datasets.length - 1 : currentIndex - 1,
        );
    };

    const showNextDataset = () => {
        setSelectedChartIndex((currentIndex) =>
            currentIndex === datasets.length - 1 ? 0 : currentIndex + 1,
        );
    };

    const handleMetricCarouselLayout = (event: LayoutChangeEvent) => {
        setMetricCarouselWidth(event.nativeEvent.layout.width);
    };

    return (
        <>
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
                    {datasets.map((dataset) => (
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
        </>
    );
}

export default WeeklyPerformanceCarousel;
