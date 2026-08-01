import type { BusinessInsightsDto, WeeklyMetrics } from "@internal/interfaces";
import { formatTrend } from "@/features/insights/lib/insightMetrics";
import { createWeeklyPerformanceDatasets } from "@/features/insights/lib/weeklyMetrics";

const weekly: WeeklyMetrics = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
const metric = (total: number): BusinessInsightsDto["overview"]["catalogVisits"] => ({
    total,
    previousTotal: 0,
    weekly,
});

describe("insight metrics", () => {
    test.each([
        [0, 0, "0% vs yesterday"],
        [10, 0, "+100% vs yesterday"],
        [15, 10, "+50% vs yesterday"],
        [5, 10, "-50% vs yesterday"],
        [2, 3, "-33.3% vs yesterday"],
    ])("formats %s from %s", (current, previous, expected) => {
        expect(formatTrend(current, previous)).toBe(expected);
    });

    it("orders and maps weekly datasets", () => {
        const result = createWeeklyPerformanceDatasets({
            ordersPlaced: metric(1),
            catalogVisits: metric(2),
            cartsCreated: metric(3),
        });

        expect(result.map(({ label }) => label)).toEqual([
            "Orders Placed",
            "Catalog Visits",
            "Carts Created",
        ]);
        expect(result[0].data).toEqual([
            { name: "Mon", value: 1 },
            { name: "Tue", value: 2 },
            { name: "Wed", value: 3 },
            { name: "Thu", value: 4 },
            { name: "Fri", value: 5 },
            { name: "Sat", value: 6 },
            { name: "Sun", value: 7 },
        ]);
    });
});
