"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    EMPTY_CATALOG_FILTERS,
    hasActiveCatalogFilters,
    type CatalogFilters,
} from "../lib/catalog-products";

type CatalogFilterMenuProps = {
    filters: CatalogFilters;
    disabled: boolean;
    onApply: (filters: CatalogFilters) => void;
};

type FilterDraft = {
    minPrice: string;
    maxPrice: string;
    onSale: boolean;
    inStock: boolean;
    featured: boolean;
};

function parseDraftPrice(value: string) {
    if (value === "") return null;
    if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return undefined;
    return Number(value);
}

function getFilterDraft(filters: CatalogFilters): FilterDraft {
    return {
        minPrice: filters.minPrice === null ? "" : String(filters.minPrice),
        maxPrice: filters.maxPrice === null ? "" : String(filters.maxPrice),
        onSale: filters.onSale,
        inStock: filters.inStock,
        featured: filters.featured,
    };
}

function getDraftFilters(draft: FilterDraft): CatalogFilters | null {
    const minPrice = parseDraftPrice(draft.minPrice);
    const maxPrice = parseDraftPrice(draft.maxPrice);

    if (
        minPrice === undefined ||
        maxPrice === undefined ||
        (minPrice !== null && maxPrice !== null && minPrice > maxPrice)
    ) {
        return null;
    }

    return {
        minPrice,
        maxPrice,
        onSale: draft.onSale,
        inStock: draft.inStock,
        featured: draft.featured,
    };
}

function getActiveFilterCount(filters: CatalogFilters) {
    return (
        Number(filters.minPrice !== null || filters.maxPrice !== null) +
        Number(filters.onSale) +
        Number(filters.inStock) +
        Number(filters.featured)
    );
}

export function CatalogFilterMenu({ filters, disabled, onApply }: CatalogFilterMenuProps) {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState(() => getFilterDraft(filters));
    const draftFilters = getDraftFilters(draft);
    const activeFilterCount = getActiveFilterCount(filters);

    function handleOpenChange(nextOpen: boolean) {
        if (nextOpen) setDraft(getFilterDraft(filters));
        setOpen(nextOpen);
    }

    function applyFilters() {
        if (!draftFilters) return;

        setOpen(false);
        onApply(draftFilters);
    }

    function clearFilters() {
        setDraft(getFilterDraft(EMPTY_CATALOG_FILTERS));
        setOpen(false);
        if (hasActiveCatalogFilters(filters)) onApply(EMPTY_CATALOG_FILTERS);
    }

    const triggerLabel =
        activeFilterCount === 0
            ? "Filter products"
            : `Filter products. ${activeFilterCount} active ${activeFilterCount === 1 ? "filter" : "filters"}`;

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                        "relative rounded-lg",
                        activeFilterCount > 0 && "border-primary bg-primary/5 text-primary",
                    )}
                    disabled={disabled}
                    aria-label={triggerLabel}
                >
                    <SlidersHorizontal className="size-5" strokeWidth={1.8} />
                    {activeFilterCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground"
                            aria-hidden="true"
                        >
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-72 rounded-lg p-0 shadow-ambient-raised">
                <div>
                    <DropdownMenuLabel className="px-3 pt-3 pb-2 text-sm font-bold">
                        Filter products
                    </DropdownMenuLabel>

                    <div
                        className="grid grid-cols-2 gap-2 px-3 pb-3"
                        onKeyDown={(event) => event.stopPropagation()}
                    >
                        <label className="space-y-1 text-xs font-medium text-muted-foreground">
                            Minimum price
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                inputMode="decimal"
                                value={draft.minPrice}
                                onChange={(event) =>
                                    setDraft((current) => ({ ...current, minPrice: event.target.value }))
                                }
                                placeholder="Min"
                                className="mt-1 h-9"
                            />
                        </label>
                        <label className="space-y-1 text-xs font-medium text-muted-foreground">
                            Maximum price
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                inputMode="decimal"
                                value={draft.maxPrice}
                                onChange={(event) =>
                                    setDraft((current) => ({ ...current, maxPrice: event.target.value }))
                                }
                                placeholder="Max"
                                className="mt-1 h-9"
                            />
                        </label>
                        {!draftFilters && (
                            <p className="col-span-2 text-xs text-destructive" role="alert">
                                Enter a valid price range.
                            </p>
                        )}
                    </div>

                    <DropdownMenuSeparator className="mx-0" />
                    <div className="p-1">
                        <DropdownMenuCheckboxItem
                            checked={draft.onSale}
                            onCheckedChange={(checked) =>
                                setDraft((current) => ({ ...current, onSale: checked === true }))
                            }
                            onSelect={(event) => event.preventDefault()}
                            className="py-2"
                        >
                            Products on sale
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={draft.inStock}
                            onCheckedChange={(checked) =>
                                setDraft((current) => ({ ...current, inStock: checked === true }))
                            }
                            onSelect={(event) => event.preventDefault()}
                            className="py-2"
                        >
                            Products in stock
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                            checked={draft.featured}
                            onCheckedChange={(checked) =>
                                setDraft((current) => ({ ...current, featured: checked === true }))
                            }
                            onSelect={(event) => event.preventDefault()}
                            className="py-2"
                        >
                            Featured products
                        </DropdownMenuCheckboxItem>
                    </div>

                    <DropdownMenuSeparator className="mx-0" />
                    <div className="flex justify-end gap-2 p-3">
                        <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                            Clear
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            disabled={!draftFilters || disabled}
                            onClick={applyFilters}
                        >
                            Apply filters
                        </Button>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
