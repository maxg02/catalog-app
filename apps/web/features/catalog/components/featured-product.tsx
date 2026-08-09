/* eslint-disable @next/next/no-img-element */
import type { ProductDto } from "@internal/interfaces";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatProductPrice, getProductPrice } from "../lib/catalog-products";

type FeaturedProductProps = {
  product: ProductDto;
};

export function FeaturedProduct({ product }: FeaturedProductProps) {
  return (
    <Card className="relative h-full w-[280px] shrink-0 snap-start gap-3 overflow-visible rounded-xl border-0 bg-transparent py-0 shadow-none">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-gray-100 shadow-lg">
        {product.image[0] ? (
          <img className="size-full object-cover" src={product.image[0]} alt={product.name} />
        ) : (
          <div
            className="grid size-full place-items-center bg-linear-to-br from-gray-100 to-gray-200 text-5xl font-bold text-muted-foreground/40"
            role="img"
            aria-label={`No image available for ${product.name}`}
          >
            {product.name.charAt(0)}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 rounded-b-xl bg-linear-to-t from-black/60 to-transparent p-4 pt-12 text-white">
          {product.bestSeller && (
            <Badge className="mb-2 rounded-full px-2 py-1 text-[10px] leading-none font-bold tracking-normal uppercase">
              Best Seller
            </Badge>
          )}
          <h3 className="line-clamp-1 text-lg leading-tight font-bold">{product.name}</h3>
          <p className="mt-0.5 text-sm text-white/90 tabular-nums">
            {formatProductPrice(getProductPrice(product))}
          </p>
        </div>
      </div>
    </Card>
  );
}
