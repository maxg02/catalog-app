"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProductDto } from "@internal/interfaces";
import {
    ChevronDown,
    LayoutGrid,
    List,
    MessageSquare,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";
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
    type CatalogSort,
} from "../lib/catalog-products";
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
}: CatalogBrowserProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [queryInput, setQueryInput] = useState(searchQuery);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const selectedSort = catalogSortOptions.find((option) => option.value === sort)!;

    const visibleProducts = useMemo(
        () => (inStockOnly ? products.filter((product) => product.onStock) : products),
        [inStockOnly, products],
    );

    function navigateTo(href: string) {
        startTransition(() => router.push(href));
    }

    function submitSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        navigateTo(getCatalogHref(businessId, 1, sort, queryInput.trim()));
    }

    function clearSearch() {
        setQueryInput("");
        if (searchQuery) navigateTo(getCatalogHref(businessId, 1, sort));
    }

    return (
        <>
            <section className="bg-card px-4 py-2" aria-label="Find products">
                <form className="flex gap-2" onSubmit={submitSearch}>
                    <label className="relative min-w-0 flex-1">
                        <span className="sr-only">Search products</span>
                        <Search
                            className="pointer-events-none absolute top-1/2 left-4 z-10 size-5 -translate-y-1/2 text-muted-foreground"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                        <Input
                            type="search"
                            name="q"
                            value={queryInput}
                            onChange={(event) => setQueryInput(event.target.value)}
                            maxLength={100}
                            placeholder="Search products..."
                            className="h-11 rounded-lg border-0 bg-gray-100 pr-10 pl-11 shadow-none placeholder:text-muted-foreground focus-visible:border-0 focus-visible:bg-gray-100 focus-visible:ring-0 focus-visible:shadow-none [&::-webkit-search-cancel-button]:hidden"
                        />
                        {queryInput && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                className="absolute top-1/2 right-2 z-10 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-gray-200"
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
                        className="size-11 rounded-lg"
                        disabled={isPending}
                        aria-label="Search products"
                    >
                        <Search className="size-5" strokeWidth={2} />
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className={cn(
                            "size-11 rounded-lg bg-gray-100 text-foreground hover:bg-gray-200",
                            inStockOnly && "bg-primary/10 text-primary hover:bg-primary/20",
                        )}
                        onClick={() => setInStockOnly((current) => !current)}
                        aria-label="Show in-stock products only"
                        aria-pressed={inStockOnly}
                    >
                        <SlidersHorizontal className="size-5" strokeWidth={1.8} />
                    </Button>
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
                                    variant="secondary"
                                    size="sm"
                                    className="h-9 rounded-full px-3 text-xs text-muted-foreground"
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
                            variant="secondary"
                            size="icon-sm"
                            className="size-9 rounded-full text-muted-foreground"
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
                    {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"} shown
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
                ) : visibleProducts.length > 0 ? (
                    <div
                        className={cn(
                            "gap-4 px-4 pb-20",
                            viewMode === "grid" ? "grid grid-cols-2" : "flex flex-col",
                        )}
                    >
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} mode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-16 text-center">
                        <h3 className="text-base font-bold">No products found</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {products.length === 0
                                ? `${businessName} has not published any products yet.`
                                : "Try another search or turn off the stock filter."}
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
