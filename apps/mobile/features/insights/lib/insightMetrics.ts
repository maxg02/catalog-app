export function formatTrend(current: number, previous: number) {
    if (previous === 0) {
        return current === 0 ? "0% vs yesterday" : "+100% vs yesterday";
    }

    const percentage = ((current - previous) / previous) * 100;
    const rounded = Number.isInteger(percentage) ? percentage.toFixed(0) : percentage.toFixed(1);
    const sign = percentage > 0 ? "+" : "";

    return `${sign}${rounded}% vs yesterday`;
}
