import { ChevronsLeft, ChevronsRight } from "lucide-react";
import type { MouseEvent } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { getCatalogHref, type CatalogSort } from "../lib/catalog-products";

type CatalogPaginationProps = {
    businessId: number;
    currentPage: number;
    totalPages: number;
    sort: CatalogSort;
    searchQuery: string;
    onNavigate: (href: string) => void;
};

function getVisiblePages(currentPage: number, totalPages: number) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const candidates = [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
    return [...new Set(candidates)].filter((page) => page >= 1 && page <= totalPages);
}

export function CatalogPagination({
    businessId,
    currentPage,
    totalPages,
    sort,
    searchQuery,
    onNavigate,
}: CatalogPaginationProps) {
    if (totalPages <= 1) return null;

    const visiblePages = getVisiblePages(currentPage, totalPages);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const disabledClassName = "pointer-events-none opacity-40";

    function navigate(event: MouseEvent<HTMLAnchorElement>) {
        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();
        onNavigate(event.currentTarget.getAttribute("href")!);
    }

    return (
        <Pagination className="px-4 pb-20" aria-label="Product catalog pages">
            <PaginationContent className="gap-0.5">
                <PaginationItem>
                    <PaginationLink
                        href={getCatalogHref(businessId, 1, sort, searchQuery)}
                        onClick={navigate}
                        size="icon-sm"
                        aria-label="Go to first page"
                        aria-disabled={isFirstPage}
                        tabIndex={isFirstPage ? -1 : undefined}
                        className={cn(isFirstPage && disabledClassName)}
                    >
                        <ChevronsLeft aria-hidden="true" />
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationPrevious
                        href={getCatalogHref(
                            businessId,
                            isFirstPage ? currentPage : currentPage - 1,
                            sort,
                            searchQuery,
                        )}
                        onClick={navigate}
                        aria-disabled={isFirstPage}
                        tabIndex={isFirstPage ? -1 : undefined}
                        className={cn(isFirstPage && disabledClassName)}
                    />
                </PaginationItem>

                {visiblePages.map((page) => (
                    <PaginationItem
                        key={page}
                        className={cn(page !== currentPage && "hidden min-[400px]:block")}
                    >
                        <PaginationLink
                            href={getCatalogHref(businessId, page, sort, searchQuery)}
                            onClick={navigate}
                            isActive={page === currentPage}
                            size="icon-sm"
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href={getCatalogHref(
                            businessId,
                            isLastPage ? currentPage : currentPage + 1,
                            sort,
                            searchQuery,
                        )}
                        onClick={navigate}
                        aria-disabled={isLastPage}
                        tabIndex={isLastPage ? -1 : undefined}
                        className={cn(isLastPage && disabledClassName)}
                    />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink
                        href={getCatalogHref(businessId, totalPages, sort, searchQuery)}
                        onClick={navigate}
                        size="icon-sm"
                        aria-label="Go to last page"
                        aria-disabled={isLastPage}
                        tabIndex={isLastPage ? -1 : undefined}
                        className={cn(isLastPage && disabledClassName)}
                    >
                        <ChevronsRight aria-hidden="true" />
                    </PaginationLink>
                </PaginationItem>
            </PaginationContent>
            <span className="sr-only">
                Page {currentPage} of {totalPages}
            </span>
        </Pagination>
    );
}
