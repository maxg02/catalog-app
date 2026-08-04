/* eslint-disable @next/next/no-img-element */
import { BusinessCategories } from "@internal/enums";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import type { BusinessProfileRow, ProductRow } from "@/interfaces";
import { mapProductRowToCatalogDto } from "@/lib/mappers/productMapper";
import { mapBusinessProfileRowToDto } from "@/lib/mappers/userBusinessMapper";
import { createClient } from "@/utils/supabase/server";

const BUSINESS_SELECT = "id,name,description,category,location,user_id,business_images(image_url)";
const PRODUCT_SELECT =
    "id,name,is_public,is_featured,price,sale,sale_price,on_stock,creation_date,product_images(id,image_url,product_id,is_main)";
const catalogFont = Plus_Jakarta_Sans({ subsets: ["latin"] });
const formatPrice = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format;

export default async function CatalogPage({ params }: { params: Promise<{ id: string }> }) {
    const businessId = Number((await params).id);
    if (!Number.isInteger(businessId) || businessId < 1) notFound();

    const supabase = createClient(await cookies());
    const [businessResult, productsResult] = await Promise.all([
        supabase.from("businesses").select(BUSINESS_SELECT).eq("id", businessId).maybeSingle(),
        supabase
            .from("products")
            .select(PRODUCT_SELECT)
            .eq("business_id", businessId)
            .eq("is_public", true)
            .order("creation_date", { ascending: false }),
    ]);

    if (businessResult.error || productsResult.error) throw new Error("Unable to load catalog");
    if (!businessResult.data) notFound();

    const business = mapBusinessProfileRowToDto(businessResult.data as BusinessProfileRow);
    const products = ((productsResult.data ?? []) as ProductRow[]).map((product) =>
        mapProductRowToCatalogDto(product),
    );
    const category = business.category == null ? "Independent business" : BusinessCategories[business.category];
    const location = business.location
        ? [business.location.address, business.location.city, business.location.country].filter(Boolean).join(", ")
        : "Location not provided";

    return (
        <main id="top" className={`min-h-screen bg-[#f5f6f7] text-[#2c2f30] ${catalogFont.className}`}>
            <header className="sticky top-0 z-20 bg-[#f5f6f7]/80 backdrop-blur-[24px]">
                <div className="mx-auto flex min-h-16 w-full max-w-[1248px] items-center justify-between gap-6 px-5 py-2.5 min-[441px]:min-h-[72px] min-[441px]:px-8 min-[441px]:py-3">
                    <a
                        className="inline-flex items-center gap-3 text-inherit no-underline"
                        href="#top"
                        aria-label={`${business.name} catalog home`}
                    >
                        <span
                            className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-[14px] bg-linear-to-br from-[#0059b6] to-[#68a0ff] text-base font-extrabold text-white min-[441px]:size-11"
                            aria-hidden="true"
                        >
                            {business.bannerImage ? (
                                <img className="size-full object-cover" src={business.bannerImage} alt="" />
                            ) : (
                                business.name[0]
                            )}
                        </span>
                        <span>
                            <strong className="block text-sm leading-tight">{business.name}</strong>
                            <small className="mt-0.5 hidden text-[0.7rem] font-semibold tracking-[0.05em] text-[#6e7274] uppercase min-[441px]:block">
                                Digital catalog
                            </small>
                        </span>
                    </a>
                    <a
                        className="hidden rounded-full bg-linear-to-br from-[#0059b6] to-[#68a0ff] px-[18px] py-[11px] text-[0.78rem] font-bold text-white no-underline shadow-[0_12px_32px_rgba(44,47,48,0.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,89,182,0.18)] motion-reduce:transition-none min-[441px]:block"
                        href="#products"
                    >
                        Browse products
                    </a>
                </div>
            </header>

            <div className="mx-auto w-full max-w-[1248px] px-5 pt-6 pb-[72px] min-[721px]:px-8 min-[721px]:pt-11 min-[721px]:pb-24">
                <section className="relative" aria-labelledby="business-name">
                    <div className="relative aspect-video overflow-hidden rounded-3xl bg-[#eff1f2] min-[721px]:aspect-[16/6] min-[721px]:rounded-[32px]">
                        {business.bannerImage ? (
                            <img
                                className="block size-full object-cover"
                                src={business.bannerImage}
                                alt={`${business.name} banner`}
                                fetchPriority="high"
                            />
                        ) : (
                            <div
                                className="grid size-full place-items-center bg-linear-to-br from-[#103c68] to-[#0059b6] text-[clamp(5rem,16vw,12rem)] font-extrabold text-white/80"
                                role="img"
                                aria-label={`${business.name} banner`}
                            >
                                <span>{business.name[0]}</span>
                            </div>
                        )}
                        <div
                            className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#181b1d]/30 to-transparent"
                            aria-hidden="true"
                        />
                    </div>

                    <div className="relative z-[2] mx-auto -mt-7 grid w-[calc(100%-24px)] grid-cols-1 gap-7 rounded-3xl bg-white/95 p-6 shadow-[0_12px_32px_rgba(44,47,48,0.06)] backdrop-blur-[24px] min-[721px]:-mt-16 min-[721px]:w-[calc(100%-80px)] min-[721px]:p-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,1fr)] lg:items-end lg:gap-12">
                        <div>
                            <p className="mb-2.5 text-[0.7rem] font-extrabold tracking-[0.12em] text-[#0059b6] uppercase">
                                Curated by {business.name}
                            </p>
                            <h1
                                id="business-name"
                                className="m-0 text-[clamp(2.25rem,5vw,4.75rem)] leading-[0.98] tracking-[-0.04em]"
                            >
                                {business.name}
                            </h1>
                            <p className="mt-5 mb-0 max-w-[680px] text-base leading-7 text-[#64686a]">
                                {business.description || `Discover the latest products from ${business.name}.`}
                            </p>
                        </div>
                        <dl className="m-0 grid grid-cols-1 gap-3 min-[441px]:grid-cols-2 min-[721px]:grid-cols-3">
                            <div className="min-w-0 rounded-2xl bg-[#eff1f2] p-4">
                                <dt className="mb-[7px] text-[0.62rem] font-extrabold tracking-[0.08em] text-[#74787a] uppercase">
                                    Category
                                </dt>
                                <dd className="m-0 overflow-hidden text-[0.76rem] leading-[1.45] font-bold text-ellipsis">
                                    {category}
                                </dd>
                            </div>
                            <div className="min-w-0 rounded-2xl bg-[#eff1f2] p-4">
                                <dt className="mb-[7px] text-[0.62rem] font-extrabold tracking-[0.08em] text-[#74787a] uppercase">
                                    Location
                                </dt>
                                <dd className="m-0 overflow-hidden text-[0.76rem] leading-[1.45] font-bold text-ellipsis">
                                    {location}
                                </dd>
                            </div>
                            <div className="min-w-0 rounded-2xl bg-[#eff1f2] p-4 min-[441px]:max-[720px]:col-span-2">
                                <dt className="mb-[7px] text-[0.62rem] font-extrabold tracking-[0.08em] text-[#74787a] uppercase">
                                    Collection
                                </dt>
                                <dd className="m-0 overflow-hidden text-[0.76rem] leading-[1.45] font-bold text-ellipsis">
                                    {products.length} {products.length === 1 ? "product" : "products"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </section>

                <section
                    id="products"
                    className="scroll-mt-24 pt-[72px] min-[721px]:pt-24"
                    aria-labelledby="catalog-heading"
                >
                    <div className="mb-8 flex items-start justify-between gap-6 min-[441px]:items-end">
                        <div>
                            <p className="mb-2.5 text-[0.7rem] font-extrabold tracking-[0.12em] text-[#0059b6] uppercase">
                                The collection
                            </p>
                            <h2
                                id="catalog-heading"
                                className="m-0 text-[clamp(2rem,4vw,3.5rem)] leading-none tracking-[-0.04em]"
                            >
                                Product catalog
                            </h2>
                        </div>
                        <p className="m-0 whitespace-nowrap rounded-full bg-[#eff1f2] px-3.5 py-[9px] text-[0.7rem] font-bold text-[#74787a] min-[441px]:mb-1">
                            {products.length} available
                        </p>
                    </div>

                    {products.length ? (
                        <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 min-[341px]:grid-cols-2 min-[721px]:grid-cols-3 min-[721px]:gap-3.5 min-[1025px]:grid-cols-4 min-[1025px]:gap-6">
                            {products.map((product) => {
                                const salePrice = product.sale ? product.salePrice : null;

                                return (
                                    <li key={product.id}>
                                        <article className="group h-full overflow-hidden rounded-[18px] bg-white shadow-[0_12px_32px_rgba(44,47,48,0.06)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[5px] hover:shadow-[0_20px_44px_rgba(44,47,48,0.1)] motion-reduce:transition-none min-[721px]:rounded-3xl">
                                            <div className="relative aspect-[1/1.06] overflow-hidden bg-[#eff1f2]">
                                                {product.mainImage ? (
                                                    <img
                                                        className="block size-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.035] motion-reduce:transition-none"
                                                        src={product.mainImage}
                                                        alt={product.name}
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div
                                                        className="grid size-full place-items-center bg-linear-to-br from-[#e2e8ec] to-[#fafafa] text-6xl font-extrabold text-[#a5aaad]"
                                                        role="img"
                                                        aria-label={`No image available for ${product.name}`}
                                                    >
                                                        {product.name[0]}
                                                    </div>
                                                )}
                                                {(salePrice !== null || product.isFeatured) && (
                                                    <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-[7px]">
                                                        {salePrice !== null && (
                                                            <span className="rounded-lg bg-[#f06436] px-[9px] py-1.5 text-[0.56rem] font-extrabold tracking-[0.06em] text-white uppercase">
                                                                Sale
                                                            </span>
                                                        )}
                                                        {product.isFeatured && (
                                                            <span className="rounded-lg bg-white/90 px-[9px] py-1.5 text-[0.56rem] font-extrabold tracking-[0.06em] text-[#0059b6] uppercase backdrop-blur-xl">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-[15px] min-[721px]:p-5">
                                                <h3 className="m-0 text-[0.78rem] leading-[1.45] min-[441px]:text-sm">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-2 mb-[18px] flex items-center gap-1.5 text-[0.64rem] font-semibold text-[#777b7d]">
                                                    <span
                                                        className={`size-1.5 shrink-0 rounded-full ${product.onStock ? "bg-[#21b66f]" : "bg-[#aeb2b4]"}`}
                                                        aria-hidden="true"
                                                    />
                                                    {product.onStock ? "In stock" : "Out of stock"}
                                                </p>
                                                <p className="m-0 flex flex-col items-start gap-[3px] tabular-nums min-[441px]:flex-row min-[441px]:items-baseline min-[441px]:gap-2">
                                                    <strong className="text-base text-[#0059b6]">
                                                        {formatPrice(salePrice ?? product.price)}
                                                    </strong>
                                                    {salePrice !== null && (
                                                        <del className="text-[0.72rem] text-[#9a9ea0]">
                                                            {formatPrice(product.price)}
                                                        </del>
                                                    )}
                                                </p>
                                            </div>
                                        </article>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="rounded-3xl bg-[#eff1f2] px-6 py-20 text-center">
                            <span className="text-3xl text-[#0059b6]" aria-hidden="true">
                                ✦
                            </span>
                            <h3 className="mt-4 mb-2 text-xl font-bold">The next collection is on its way</h3>
                            <p className="m-0 text-[#74787a]">
                                {business.name} has not published any products yet.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <footer className="flex justify-center gap-3 bg-[#eff1f2] px-8 py-10 text-[0.7rem] text-[#777b7d]">
                <p className="m-0 font-extrabold text-[#2c2f30]">{business.name}</p>
                <span>Curated digital catalog</span>
            </footer>
        </main>
    );
}