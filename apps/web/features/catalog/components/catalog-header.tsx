/* eslint-disable @next/next/no-img-element */
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CatalogHeaderProps = {
  businessName: string;
  image: string | null;
};

export function CatalogHeader({ businessName, image }: CatalogHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-[72px] items-center justify-between border-b border-gray-100 bg-card/80 p-4 backdrop-blur-md">
      <div className="flex size-10 shrink-0 items-center">
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

      <p className="min-w-0 flex-1 truncate px-3 text-lg leading-tight font-bold tracking-[-0.015em]">
        {businessName}
      </p>

      <Button
        variant="ghost"
        size="icon-sm"
        className="size-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20"
        asChild
      >
        <a
          href={`mailto:?subject=${encodeURIComponent(`${businessName} catalog`)}`}
          aria-label={`Share ${businessName} catalog by email`}
        >
          <Share2 className="size-5" strokeWidth={1.8} />
        </a>
      </Button>
    </header>
  );
}
