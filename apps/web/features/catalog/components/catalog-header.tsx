"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DEFAULT_CATALOG_SORT,
    getCatalogHref,
    type CatalogFilters,
    type CatalogSort,
} from "../lib/catalog-products";
import { CatalogFilterMenu } from "./catalog-filter-menu";

type CatalogHeaderProps = {
    businessName: string;
    businessId: number;
    image: string | null;
    searchQuery: string;
    sort: CatalogSort;
    filters: CatalogFilters;
};

export function CatalogHeader({
    businessName,
    businessId,
    image,
    searchQuery,
    sort,
    filters,
}: CatalogHeaderProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [hasScrolled, setHasScrolled] = useState(false);
    const filterStateKey = JSON.stringify(filters);

    useEffect(() => {
        function updateHeaderState() {
            setHasScrolled(window.scrollY > 0);
        }

        updateHeaderState();
        window.addEventListener("scroll", updateHeaderState, { passive: true });
        return () => window.removeEventListener("scroll", updateHeaderState);
    }, []);

    function applyFilters(nextFilters: CatalogFilters) {
        startTransition(() => router.push(getCatalogHref(businessId, 1, sort, searchQuery, nextFilters)));
    }

    return (
        <header
            data-scrolled={hasScrolled}
            className="sticky top-0 z-50 h-[clamp(4rem,12vw,4.5rem)] bg-card transition-[background-color,box-shadow,backdrop-filter] duration-200 data-[scrolled=true]:bg-card/80 data-[scrolled=true]:shadow-sm data-[scrolled=true]:backdrop-blur-xl min-[44rem]:bg-background min-[44rem]:data-[scrolled=true]:bg-background/80 min-[44rem]:data-[scrolled=true]:shadow-ambient"
        >
            <div className="flex h-full w-full items-center justify-between px-[clamp(1rem,3vw,2rem)]">
                <div className="flex min-w-0 items-center">
                    <div className="flex size-10 shrink-0 items-center min-[44rem]:hidden">
                        {image ? (
                            <img
                                className="size-10 rounded-full border border-gray-200 object-cover"
                                src={image}
                                alt={`${businessName} logo`}
                            />
                        ) : (
                            <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                {businessName.charAt(0)}
                            </span>
                        )}
                    </div>

                    <p className="min-w-0 flex-1 truncate px-3 text-[clamp(1rem,3vw,1.125rem)] leading-tight font-bold tracking-[-0.015em] min-[44rem]:max-w-[clamp(12rem,28vw,18rem)] min-[44rem]:px-0 min-[44rem]:tracking-[0.12em] min-[44rem]:uppercase">
                        {businessName}
                    </p>
                </div>

                <div className="hidden items-center gap-2 min-[44rem]:flex">
                    <form
                        action={`/catalog/${businessId}`}
                        method="get"
                        className="relative flex w-[clamp(15rem,34vw,18rem)] items-center"
                    >
                        {sort !== DEFAULT_CATALOG_SORT && (
                            <input type="hidden" name="sort" value={sort} />
                        )}
                        {filters.minPrice !== null && (
                            <input type="hidden" name="minPrice" value={filters.minPrice} />
                        )}
                        {filters.maxPrice !== null && (
                            <input type="hidden" name="maxPrice" value={filters.maxPrice} />
                        )}
                        {filters.onSale && <input type="hidden" name="sale" value="1" />}
                        {filters.inStock && <input type="hidden" name="stock" value="1" />}
                        {filters.featured && <input type="hidden" name="featured" value="1" />}
                        <Search
                            className="pointer-events-none absolute left-3 z-10 size-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Input
                            type="search"
                            name="q"
                            defaultValue={searchQuery}
                            placeholder="Search catalog..."
                            aria-label="Search catalog"
                            className="pl-9"
                        />
                        <button type="submit" className="sr-only">
                            Search catalog
                        </button>
                    </form>

                    <div className="min-[52rem]:hidden">
                        <CatalogFilterMenu
                            key={`header:${filterStateKey}`}
                            filters={filters}
                            disabled={isPending}
                            onApply={applyFilters}
                        />
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 min-[44rem]:hidden"
                    asChild
                >
                    <a
                        href={`mailto:?subject=${encodeURIComponent(`${businessName} catalog`)}`}
                        aria-label={`Share ${businessName} catalog by email`}
                    >
                        <Share2 className="size-5" strokeWidth={1.8} />
                    </a>
                </Button>
            </div>
        </header>
    );
}
