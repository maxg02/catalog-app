import { THEME } from "@/lib/theme";
import { toRgb, toRgba } from "@/lib/utils";
import { PlusJakartaSans_300Light } from "@expo-google-fonts/plus-jakarta-sans";
import { LinearGradient, Text as SkiaText, useFont, vec } from "@shopify/react-native-skia";
import { useColorScheme } from "nativewind";
import {
    AnimatedPath,
    CartesianChart,
    useBarPath,
    type ChartBounds,
    type PointsArray,
} from "victory-native";

type WeeklyPerformanceDatum = {
    name: string;
    value: number;
};

type WeeklyPerformanceChartProps = {
    data: WeeklyPerformanceDatum[];
};

type GradientBarsProps = {
    points: PointsArray;
    chartBounds: ChartBounds;
    primary: string;
};

function GradientBars({ points, chartBounds, primary }: GradientBarsProps) {
    const { path } = useBarPath(points, chartBounds, 0.35, {
        topLeft: 6,
        topRight: 6,
    });
    const chartMidX = chartBounds.left + (chartBounds.right - chartBounds.left) / 2;

    return (
        <AnimatedPath path={path} style="fill" animate={{ type: "timing", duration: 300 }}>
            <LinearGradient
                start={vec(chartMidX, chartBounds.top)}
                end={vec(chartMidX, chartBounds.bottom)}
                colors={[toRgba(primary, 0.85), toRgba(primary, 0.25)]}
            />
        </AnimatedPath>
    );
}

function WeeklyPerformanceChart({ data }: WeeklyPerformanceChartProps) {
    const font = useFont(PlusJakartaSans_300Light);

    const { colorScheme } = useColorScheme();
    const currentTheme = colorScheme === "dark" ? THEME.dark : THEME.light;
    const foregroundColor = toRgb(currentTheme.foreground);
    const mutedForegroundColor = toRgb(currentTheme.mutedForeground);

    return (
        <CartesianChart
            data={data}
            xKey="name"
            yKeys={["value"]}
            domain={{ y: [0] }}
            xAxis={{ font, lineColor: "transparent", labelOffset: 10, labelColor: foregroundColor }}
            yAxis={[{ lineColor: "transparent" }]}
            padding={{ bottom: 20 }}
            domainPadding={{ right: 20, left: 20, top: 20 }}
        >
            {({ points, chartBounds }) => {
                return (
                    <>
                        <GradientBars
                            points={points.value}
                            chartBounds={chartBounds}
                            primary={currentTheme.primary}
                        />
                        {font &&
                            points.value.map((point) => {
                                if (point.y == null || point.yValue == null) {
                                    return null;
                                }

                                const label = String(point.yValue);
                                const labelWidth = font.measureText(label).width;

                                return (
                                    <SkiaText
                                        key={`${point.xValue}-${point.yValue}`}
                                        x={point.x - labelWidth / 2}
                                        y={point.y - 7}
                                        text={label}
                                        font={font}
                                        color={mutedForegroundColor}
                                    />
                                );
                            })}
                    </>
                );
            }}
        </CartesianChart>
    );
}

export default WeeklyPerformanceChart;
