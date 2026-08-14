import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <Card
            className="min-w-0 gap-3 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none lg:rounded-3xl lg:bg-card lg:p-4 lg:shadow-ambient"
            aria-hidden="true"
        >
            <Skeleton className="aspect-square w-full rounded-xl lg:rounded-2xl" />
            <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="mt-2 h-5 w-20" />
                <Skeleton className="mt-2 h-3 w-16" />
            </div>
        </Card>
    );
}
