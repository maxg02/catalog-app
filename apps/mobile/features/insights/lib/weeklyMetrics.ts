import type { BusinessInsightsDto, WeeklyMetrics } from "@internal/interfaces";

const weeklyMetricLabels = [
    ["Mon", "mon"],
    ["Tue", "tue"],
    ["Wed", "wed"],
    ["Thu", "thu"],
    ["Fri", "fri"],
    ["Sat", "sat"],
    ["Sun", "sun"],
] as const;

type BusinessInsightsOverview = BusinessInsightsDto["overview"];

function toWeeklyChartData(weekly: WeeklyMetrics) {
    return weeklyMetricLabels.map(([name, key]) => ({
        name,
        value: weekly[key],
    }));
}

export type WeeklyPerformanceDataset = ReturnType<typeof createWeeklyPerformanceDatasets>[number];

export function createWeeklyPerformanceDatasets(overview: BusinessInsightsOverview) {
    return [
        {
            label: "Orders Placed",
            data: toWeeklyChartData(overview.ordersPlaced.weekly),
        },
        {
            label: "Catalog Visits",
            data: toWeeklyChartData(overview.catalogVisits.weekly),
        },
        {
            label: "Carts Created",
            data: toWeeklyChartData(overview.cartsCreated.weekly),
        },
    ];
}
