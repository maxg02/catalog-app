import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { BusinessProfileRow, ProductRow } from "@/interfaces";
import { BusinessSummary } from "@/features/catalog/components/business-summary";
import { CatalogBrowser } from "@/features/catalog/components/catalog-browser";
import { CatalogHeader } from "@/features/catalog/components/catalog-header";
import { DEFAULT_CATALOG_SORT, getCatalogHref } from "@/features/catalog/lib/catalog-products";
import {
    getPostgrestSearchPattern,
    getSortOrder,
    isAlternativeCatalogView,
    parseBusinessId,
    parseCatalogFilters,
    parseCatalogSort,
    parsePageNumber,
    parseSearchQuery,
    PRODUCTS_PER_PAGE,
} from "@/features/catalog/lib/catalog-query";
import { mapBusinessProfileRowToDto } from "@/lib/mappers/userBusinessMapper";
import { mapProductRowToDto } from "@/lib/mappers/productMapper";
import { createClient } from "@/utils/supabase/server";

const BUSINESS_SELECT = "id,name,description,category,location,user_id,business_images(image_url)";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,description,sale,sale_price,sale_end_date,on_stock,creation_date,business_id,details,product_images(id,image_url,product_id,is_main)";
type CatalogPageProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{
        page?: string | string[];
        sort?: string | string[];
        q?: string | string[];
        minPrice?: string | string[];
        maxPrice?: string | string[];
        sale?: string | string[];
        stock?: string | string[];
        featured?: string | string[];
    }>;
};

function requireCatalogValue<T>(value: T | null) {
    if (value === null) notFound();
    return value;
}

export async function generateMetadata({ params, searchParams }: CatalogPageProps): Promise<Metadata> {
    const businessId = requireCatalogValue(parseBusinessId((await params).id));
    const resolvedSearchParams = await searchParams;
    const page = requireCatalogValue(parsePageNumber(resolvedSearchParams.page));
    const sort = requireCatalogValue(parseCatalogSort(resolvedSearchParams.sort));
    const searchQuery = requireCatalogValue(parseSearchQuery(resolvedSearchParams.q));
    const filters = requireCatalogValue(parseCatalogFilters(resolvedSearchParams));
    const requestHeaders = await headers();
    const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
    const host = forwardedHost || requestHeaders.get("host");
    const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const protocol = forwardedProtocol || (host?.startsWith("localhost") ? "http" : "https");

    return {
        metadataBase: host ? new URL(`${protocol}://${host}`) : undefined,
        title: page === 1 ? "Product Catalog" : `Product Catalog - Page ${page}`,
        alternates: {
            canonical: getCatalogHref(businessId, page, DEFAULT_CATALOG_SORT),
        },
        robots: isAlternativeCatalogView(sort, searchQuery, filters)
            ? {
                  index: false,
                  follow: true,
              }
            : undefined,
    };
}

export default async function CatalogPage({ params, searchParams }: CatalogPageProps) {
    const businessId = requireCatalogValue(parseBusinessId((await params).id));
    const resolvedSearchParams = await searchParams;
    const currentPage = requireCatalogValue(parsePageNumber(resolvedSearchParams.page));
    const sort = requireCatalogValue(parseCatalogSort(resolvedSearchParams.sort));
    const searchQuery = requireCatalogValue(parseSearchQuery(resolvedSearchParams.q));
    const filters = requireCatalogValue(parseCatalogFilters(resolvedSearchParams));
    if (resolvedSearchParams.sort === DEFAULT_CATALOG_SORT) {
        redirect(getCatalogHref(businessId, currentPage, DEFAULT_CATALOG_SORT, searchQuery, filters));
    }
    if (resolvedSearchParams.q !== undefined && !searchQuery) {
        redirect(getCatalogHref(businessId, currentPage, sort, "", filters));
    }

    const sortOrder = getSortOrder(sort);
    const firstProductIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const lastProductIndex = firstProductIndex + PRODUCTS_PER_PAGE - 1;

    const supabase = createClient(await cookies());
    let productsQuery = supabase
        .from("products")
        .select(PRODUCT_SELECT, { count: "exact" })
        .eq("business_id", businessId)
        .eq("is_public", true);

    if (searchQuery) {
        const searchPattern = getPostgrestSearchPattern(searchQuery);
        productsQuery = productsQuery.or(
            `name.ilike.${searchPattern},description.ilike.${searchPattern}`,
        );
    }

    if (filters.minPrice !== null) productsQuery = productsQuery.gte("price", filters.minPrice);
    if (filters.maxPrice !== null) productsQuery = productsQuery.lte("price", filters.maxPrice);
    if (filters.onSale) productsQuery = productsQuery.eq("sale", true);
    if (filters.inStock) productsQuery = productsQuery.eq("on_stock", true);
    if (filters.featured) productsQuery = productsQuery.eq("is_featured", true);

    productsQuery = productsQuery
        .order(sortOrder.column, { ascending: sortOrder.ascending })
        .order("id", { ascending: sortOrder.ascending })
        .range(firstProductIndex, lastProductIndex);

    const [businessResult, productsResult, featuredProductsResult] = await Promise.all([
        supabase.from("businesses").select(BUSINESS_SELECT).eq("id", businessId).maybeSingle(),
        productsQuery,
        supabase
            .from("products")
            .select(PRODUCT_SELECT)
            .eq("business_id", businessId)
            .eq("is_public", true)
            .eq("is_featured", true)
            .order("creation_date", { ascending: false }),
    ]);

    if (businessResult.error || featuredProductsResult.error) {
        throw new Error("Unable to load catalog");
    }
    if (!businessResult.data) notFound();
    if (productsResult.error?.code === "PGRST103") notFound();
    if (productsResult.error) throw new Error("Unable to load catalog");

    const totalProducts = productsResult.count ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));
    if (currentPage > totalPages) notFound();

    const business = mapBusinessProfileRowToDto(businessResult.data as BusinessProfileRow);
    const products = ((productsResult.data ?? []) as ProductRow[]).map((product) =>
        mapProductRowToDto(product),
    );
    const featuredProducts = ((featuredProductsResult.data ?? []) as ProductRow[]).map((product) =>
        mapProductRowToDto(product),
    );
    const locationParts = business.location
        ? [business.location.city, business.location.country].filter(Boolean)
        : [];
    const location = locationParts.length > 0 ? locationParts.join(", ") : "Location not provided";

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="relative mx-auto flex min-h-screen w-full flex-col bg-background shadow-sm min-[40rem]:shadow-none xl:max-w-screen-xl">
                <CatalogHeader
                    businessName={business.name}
                    businessId={businessId}
                    image={business.bannerImage}
                    searchQuery={searchQuery}
                    sort={sort}
                    filters={filters}
                />

                <div className="w-full min-[40rem]:px-[clamp(1.25rem,3vw,2rem)] min-[40rem]:py-[clamp(1.25rem,3vw,2rem)]">
                    <BusinessSummary
                        name={business.name}
                        description={business.description}
                        image={business.bannerImage}
                        location={location}
                    />
                    <CatalogBrowser
                        key={`search:${searchQuery}`}
                        products={products}
                        featuredProducts={featuredProducts}
                        businessName={business.name}
                        businessId={businessId}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        sort={sort}
                        searchQuery={searchQuery}
                        filters={filters}
                    />
                </div>

                <footer className="mt-auto hidden bg-surface-container-high px-[clamp(1.5rem,3vw,2rem)] py-[clamp(2.5rem,5vw,3rem)] shadow-inner min-[52rem]:block">
                    <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-[clamp(1.5rem,3vw,2rem)]">
                        <div>
                            <h2 className="text-xl font-bold tracking-[0.12em] text-primary uppercase">
                                {business.name}
                            </h2>
                            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                {business.description ||
                                    `Discover products and services from ${business.name}.`}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold tracking-[0.16em] uppercase">
                                Contact &amp; location
                            </h3>
                            <p className="mt-4 text-sm text-muted-foreground">{location}</p>
                            <a
                                className="mt-2 inline-block text-sm text-primary hover:underline"
                                href={`mailto:?subject=${encodeURIComponent(`Inquiry for ${business.name}`)}`}
                            >
                                Send an inquiry
                            </a>
                        </div>
                        <div className="text-right">
                            <h3 className="text-xs font-bold tracking-[0.16em] uppercase">
                                Share catalog
                            </h3>
                            <a
                                className="mt-4 inline-block text-sm text-primary hover:underline"
                                href={`mailto:?subject=${encodeURIComponent(`${business.name} catalog`)}`}
                            >
                                Share by email
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    );
}
