/* eslint-disable @next/next/no-img-element */
import { Search, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEFAULT_CATALOG_SORT, type CatalogFilters, type CatalogSort } from "../lib/catalog-products";

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
    return (
        <header className="sticky top-0 z-50 h-[72px] bg-card/80 backdrop-blur-xl lg:h-16 lg:bg-background/80 lg:shadow-ambient">
            <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4 lg:px-8">
                <div className="flex min-w-0 items-center">
                    <div className="flex size-10 shrink-0 items-center lg:hidden">
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

                    <p className="min-w-0 flex-1 truncate px-3 text-lg leading-tight font-bold tracking-[-0.015em] lg:max-w-72 lg:px-0 lg:text-base lg:tracking-[0.12em] lg:uppercase">
                        {businessName}
                    </p>
                </div>

                <form
                    action={`/catalog/${businessId}`}
                    method="get"
                    className="relative hidden w-72 items-center lg:flex"
                >
                    {sort !== DEFAULT_CATALOG_SORT && <input type="hidden" name="sort" value={sort} />}
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
                        className="h-9 rounded-2xl border-0 bg-surface-container-high pl-9 shadow-inner focus-visible:bg-card"
                    />
                    <button type="submit" className="sr-only">
                        Search catalog
                    </button>
                </form>

                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 lg:hidden"
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
