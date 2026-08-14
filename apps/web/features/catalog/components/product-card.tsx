/* eslint-disable @next/next/no-img-element */
import type { ProductDto } from "@internal/interfaces";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatProductPrice, getProductPrice } from "../lib/catalog-products";

type ProductCardProps = {
    product: ProductDto;
};

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Card className="min-w-0 gap-3 overflow-visible rounded-none border-0 bg-transparent py-0 shadow-none lg:rounded-3xl lg:bg-card lg:p-4 lg:shadow-ambient lg:ring-1 lg:ring-foreground/5">
            <div className="group relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm lg:rounded-2xl">
                {product.image[0] ? (
                    <img
                        className="size-full object-cover transition-transform duration-500 lg:group-hover:scale-105"
                        src={product.image[0]}
                        alt={product.name}
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="grid size-full place-items-center bg-linear-to-br from-gray-100 to-gray-200 text-4xl font-bold text-muted-foreground/40"
                        role="img"
                        aria-label={`No image available for ${product.name}`}
                    >
                        {product.name.charAt(0)}
                    </div>
                )}

                {product.sale && (
                    <Badge
                        variant="warning"
                        className="absolute top-2 left-2 rounded px-1.5 py-0.5 text-[9px] leading-none font-bold tracking-normal uppercase"
                    >
                        Sale
                    </Badge>
                )}
            </div>

            <div className="min-w-0">
                <h3 className="line-clamp-2 text-sm leading-tight font-semibold lg:text-base">
                    {product.name}
                </h3>
                <div className="mt-1 flex items-center gap-2 tabular-nums">
                    <p className="text-base font-bold text-primary">
                        {formatProductPrice(getProductPrice(product))}
                    </p>
                    {product.sale && product.salePrice !== null && (
                        <del className="text-[10px] text-gray-400 self-baseline">
                            {formatProductPrice(product.price)}
                        </del>
                    )}
                </div>
                <p className="mt-1 flex items-center gap-1 text-[10px] font-medium text-gray-500">
                    <span
                        className={cn(
                            "size-2 rounded-full",
                            product.onStock ? "bg-green-500" : "bg-gray-300",
                        )}
                        aria-hidden="true"
                    />
                    {product.onStock ? "In Stock" : "Out of stock"}
                </p>
            </div>
        </Card>
    );
}
