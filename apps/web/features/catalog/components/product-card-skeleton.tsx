import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <Card
            className="min-w-0 gap-3 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none min-[36rem]:rounded-[clamp(1rem,2.5vw,1.5rem)] min-[36rem]:bg-card min-[36rem]:p-[clamp(0.75rem,1.8vw,1rem)] min-[36rem]:shadow-ambient"
            aria-hidden="true"
        >
            <Skeleton className="aspect-square w-full rounded-[clamp(0.75rem,2vw,1rem)]" />
            <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="mt-2 h-5 w-20" />
                <Skeleton className="mt-2 h-3 w-16" />
            </div>
        </Card>
    );
}
