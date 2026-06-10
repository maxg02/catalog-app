import type { ReactNode } from "react";
import { useWindowDimensions, View } from "react-native";
import { PackageSearchIcon, ReceiptTextIcon, ShoppingCartIcon, TrendingUpIcon } from "lucide-nativewind";
import type { UserBusinessDto } from "@internal/interfaces";
import Card from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatTrend } from "@/features/insights/lib/insightMetrics";

type BusinessInsightsOverview = UserBusinessDto["insights"]["overview"];

type OverviewCardProps = {
    className?: string;
    detail: string;
    detailClassName: string;
    detailNumberOfLines?: number;
    icon: ReactNode;
    inlineDetail?: boolean;
    title: string;
    value: string | number;
};

function OverviewCard({
    className,
    detail,
    detailClassName,
    detailNumberOfLines,
    icon,
    inlineDetail,
    title,
    value,
}: OverviewCardProps) {
    return (
        <Card className={className}>
            <View className="flex-row justify-between items-center">
                <Text variant={"muted"} numberOfLines={1}>
                    {title}
                </Text>
                {icon}
            </View>
            {inlineDetail ? (
                <View className="flex-row items-center justify-between">
                    <Text variant={"h1"} className="text-start mt-2">
                        {value}
                    </Text>
                    <Text className={detailClassName} numberOfLines={detailNumberOfLines}>
                        {detail}
                    </Text>
                </View>
            ) : (
                <>
                    <Text variant={"h1"} className="text-start mt-2">
                        {value}
                    </Text>
                    <Text className={detailClassName} numberOfLines={detailNumberOfLines}>
                        {detail}
                    </Text>
                </>
            )}
        </Card>
    );
}

type OverviewCardsProps = {
    overview: BusinessInsightsOverview;
};

function OverviewCards({ overview }: OverviewCardsProps) {
    const { width } = useWindowDimensions();
    const isOverviewGrid = width >= 640;

    const cartsCreated = overview.cartsCreated.total;
    const ordersPlaced = overview.ordersPlaced.total;
    const catalogVisits = overview.catalogVisits.total;
    const catalogToOrderRate = (ordersPlaced / catalogVisits) * 100;

    const conversionCard = (
        <OverviewCard
            className={isOverviewGrid ? "flex-1 py-4 px-6" : "py-4 px-6"}
            detail={`${ordersPlaced} orders from ${catalogVisits} visits`}
            detailClassName="text-xs text-muted-foreground mt-2"
            detailNumberOfLines={1}
            icon={<TrendingUpIcon className="text-primary" size={20} />}
            inlineDetail={!isOverviewGrid}
            title="Conversion Funnel"
            value={`${catalogToOrderRate.toFixed(1)}%`}
        />
    );
    const catalogVisitsCard = (
        <OverviewCard
            className="flex-1 py-4 px-6"
            detail={formatTrend(catalogVisits, overview.catalogVisits.previousTotal)}
            detailClassName="text-xs text-primary mt-2"
            icon={<PackageSearchIcon className="text-primary" size={20} />}
            title="Catalog Visits"
            value={catalogVisits}
        />
    );
    const ordersPlacedCard = (
        <OverviewCard
            className="flex-1 py-4 px-6"
            detail={formatTrend(ordersPlaced, overview.ordersPlaced.previousTotal)}
            detailClassName="text-xs text-destructive mt-2"
            icon={<ReceiptTextIcon className="text-primary" size={20} />}
            title="Orders Placed"
            value={ordersPlaced}
        />
    );
    const cartsCreatedCard = (
        <OverviewCard
            className={isOverviewGrid ? "flex-1 py-4 px-6" : "py-4 px-6"}
            detail={formatTrend(cartsCreated, overview.cartsCreated.previousTotal)}
            detailClassName="text-xs text-destructive mt-2"
            icon={<ShoppingCartIcon className="text-primary" size={20} />}
            inlineDetail={!isOverviewGrid}
            title="Carts Created"
            value={cartsCreated}
        />
    );

    if (isOverviewGrid) {
        return (
            <View className="gap-3">
                <View className="flex-row gap-3">
                    {conversionCard}
                    {catalogVisitsCard}
                </View>
                <View className="flex-row gap-3">
                    {ordersPlacedCard}
                    {cartsCreatedCard}
                </View>
            </View>
        );
    }

    return (
        <View className="gap-3">
            {conversionCard}
            <View className="flex-row gap-3">
                {catalogVisitsCard}
                {ordersPlacedCard}
            </View>
            {cartsCreatedCard}
        </View>
    );
}

export default OverviewCards;
