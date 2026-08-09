import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ProductCardSkeletonProps = {
    mode: "grid" | "list";
};

export function ProductCardSkeleton({ mode }: ProductCardSkeletonProps) {
    return (
        <Card
            className={cn(
                "min-w-0 gap-3 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none",
                mode === "list" && "flex-row items-center gap-4",
            )}
            aria-hidden="true"
        >
            <Skeleton
                className={cn(
                    "aspect-square w-full rounded-xl",
                    mode === "list" && "size-28 shrink-0",
                )}
            />
            <div className="min-w-0 flex-1">
                <Skeleton className="h-4 w-4/5" />
                {mode === "list" && <Skeleton className="mt-2 h-3 w-full" />}
                <Skeleton className="mt-2 h-5 w-20" />
                <Skeleton className="mt-2 h-3 w-16" />
            </div>
        </Card>
    );
}
