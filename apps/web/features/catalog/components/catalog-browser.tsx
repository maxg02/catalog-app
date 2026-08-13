"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProductDto } from "@internal/interfaces";
import { ChevronDown, LayoutGrid, List, MessageSquare, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    catalogSortOptions,
    getCatalogHref,
    hasActiveCatalogFilters,
    type CatalogFilters,
    type CatalogSort,
} from "../lib/catalog-products";
import { CatalogFilterMenu } from "./catalog-filter-menu";
import { FeaturedProduct } from "./featured-product";
import { CatalogPagination } from "./catalog-pagination";
import { ProductCard } from "./product-card";
import { ProductCardSkeleton } from "./product-card-skeleton";

type CatalogBrowserProps = {
    products: ProductDto[];
    featuredProducts: ProductDto[];
    businessName: string;
    businessId: number;
    currentPage: number;
    totalPages: number;
    sort: CatalogSort;
    searchQuery: string;
    filters: CatalogFilters;
};

export function CatalogBrowser({
    products,
    featuredProducts,
    businessName,
    businessId,
    currentPage,
    totalPages,
    sort,
    searchQuery,
    filters,
}: CatalogBrowserProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [queryInput, setQueryInput] = useState(searchQuery);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const selectedSort = catalogSortOptions.find((option) => option.value === sort)!;
    const hasFilters = hasActiveCatalogFilters(filters);

    function navigateTo(href: string) {
        startTransition(() => router.push(href));
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigateTo(getCatalogHref(businessId, 1, sort, queryInput.trim(), filters));
    }

    function clearSearch() {
        setQueryInput("");
        if (searchQuery) navigateTo(getCatalogHref(businessId, 1, sort, "", filters));
    }

    return (
        <>
            <section className="bg-card px-4 py-2" aria-label="Find products">
                <form className="flex gap-2" onSubmit={submitSearch}>
                    <label className="relative min-w-0 flex-1">
                        <span className="sr-only">Search products</span>
                        <Input
                            type="search"
                            name="q"
                            value={queryInput}
                            onChange={(event) => setQueryInput(event.target.value)}
                            maxLength={100}
                            placeholder="Search products..."
                            className="[&::-webkit-search-cancel-button]:hidden"
                        />
                        {queryInput && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full"
                                onClick={clearSearch}
                                disabled={isPending}
                                aria-label="Clear search"
                            >
                                <X className="size-4" />
                            </Button>
                        )}
                    </label>

                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-lg"
                        disabled={isPending}
                        aria-label="Search products"
                    >
                        <Search className="size-5" strokeWidth={2} />
                    </Button>

                    <CatalogFilterMenu
                        filters={filters}
                        disabled={isPending}
                        onApply={(nextFilters) =>
                            navigateTo(getCatalogHref(businessId, 1, sort, searchQuery, nextFilters))
                        }
                    />
                </form>
            </section>

            {featuredProducts.length > 0 && (
                <section aria-labelledby="featured-heading">
                    <div className="flex items-center justify-between px-4 pt-6 pb-2">
                        <h2
                            id="featured-heading"
                            className="text-[20px] leading-tight font-bold tracking-[-0.015em]"
                        >
                            Featured Collection
                        </h2>
                        <Button
                            variant="link"
                            className="h-auto p-0 text-sm font-semibold no-underline hover:no-underline"
                            asChild
                        >
                            <a href="#products">View All</a>
                        </Button>
                    </div>

                    <div className="flex snap-x scroll-px-4 gap-4 overflow-x-auto py-4 px-4 pt-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {featuredProducts.map((product) => (
                            <FeaturedProduct key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            )}

            <section
                id="products"
                className="scroll-mt-32"
                aria-labelledby="products-heading"
                aria-busy={isPending}
            >
                <div className="flex items-center justify-between px-4 pt-6 pb-3">
                    <h2
                        id="products-heading"
                        className="text-[20px] leading-tight font-bold tracking-[-0.015em]"
                    >
                        Product Catalog
                    </h2>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 rounded-full px-3 text-xs"
                                    aria-label={`Sort products. Current order: ${selectedSort.shortLabel}`}
                                >
                                    {selectedSort.shortLabel}
                                    <ChevronDown className="size-3.5" strokeWidth={2} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-lg shadow-ambient-raised"
                            >
                                <DropdownMenuRadioGroup
                                    value={sort}
                                    onValueChange={(value) =>
                                        navigateTo(
                                            getCatalogHref(
                                                businessId,
                                                1,
                                                value as CatalogSort,
                                                searchQuery,
                                                filters,
                                            ),
                                        )
                                    }
                                >
                                    {catalogSortOptions.map((option) => (
                                        <DropdownMenuRadioItem
                                            key={option.value}
                                            value={option.value}
                                            className="py-2 focus:bg-secondary"
                                        >
                                            {option.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="size-9 rounded-full"
                            onClick={() =>
                                setViewMode((current) => (current === "grid" ? "list" : "grid"))
                            }
                            aria-label={`Switch to ${viewMode === "grid" ? "list" : "grid"} view`}
                            aria-pressed={viewMode === "list"}
                        >
                            {viewMode === "grid" ? (
                                <LayoutGrid className="size-4" strokeWidth={1.8} />
                            ) : (
                                <List className="size-4" strokeWidth={1.8} />
                            )}
                        </Button>
                    </div>
                </div>

                <p className="sr-only" role="status" aria-live="polite">
                    {products.length} {products.length === 1 ? "product" : "products"} shown
                </p>

                {isPending ? (
                    <div
                        className={cn(
                            "gap-4 px-4 pb-20",
                            viewMode === "grid" ? "grid grid-cols-2" : "flex flex-col",
                        )}
                        role="status"
                        aria-label="Loading products"
                    >
                        {Array.from({ length: 4 }, (_, index) => (
                            <ProductCardSkeleton key={index} mode={viewMode} />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div
                        className={cn(
                            "gap-4 px-4 pb-20",
                            viewMode === "grid" ? "grid grid-cols-2" : "flex flex-col",
                        )}
                    >
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} mode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <h3 className="text-base font-bold">No products found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {hasFilters
                                ? "Try adjusting or clearing your filters."
                                : searchQuery
                                  ? "Try another search."
                                  : `${businessName} has not published any products yet.`}
                        </p>
                    </div>
                )}

                {!isPending && (
                    <CatalogPagination
                        businessId={businessId}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        sort={sort}
                        searchQuery={searchQuery}
                        filters={filters}
                        onNavigate={navigateTo}
                    />
                )}
            </section>

            <Button
                className="fixed right-6 bottom-6 z-50 h-auto rounded-full px-6 py-3 font-bold shadow-[0_8px_30px_rgba(19,164,236,0.4)] transition-transform active:scale-95"
                asChild
            >
                <a href={`mailto:?subject=${encodeURIComponent(`Inquiry for ${businessName}`)}`}>
                    <MessageSquare className="size-5 fill-current" strokeWidth={0} />
                    Inquiry
                </a>
            </Button>

            <div className="h-10 bg-card" aria-hidden="true" />
        </>
    );
}
