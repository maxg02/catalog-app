/* eslint-disable @next/next/no-img-element */
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type BusinessSummaryProps = {
  name: string;
  description: string | null;
  image: string | null;
  location: string;
};

export function BusinessSummary({ name, description, image, location }: BusinessSummaryProps) {
  return (
    <section
      id="about"
      className="relative flex scroll-mt-20 p-4 pb-2 lg:h-80 lg:overflow-hidden lg:rounded-3xl lg:bg-surface-container-low lg:p-0 lg:shadow-ambient-raised"
      aria-label="Business details"
    >
      {image && (
        <>
          <img
            className="absolute inset-0 hidden size-full object-cover lg:block"
            src={image}
            alt=""
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden bg-linear-to-t from-black/80 via-black/20 to-transparent lg:block"
            aria-hidden="true"
          />
        </>
      )}

      <div className="relative flex w-full items-center gap-4 lg:items-end lg:gap-6 lg:p-10">
        {image ? (
          <img
            className="size-24 shrink-0 rounded-xl object-cover shadow-md lg:size-32 lg:rounded-2xl lg:border-4 lg:border-white/20 lg:bg-card lg:shadow-ambient-raised"
            src={image}
            alt={`${name} showroom`}
            fetchPriority="high"
          />
        ) : (
          <span className="grid size-24 shrink-0 place-items-center rounded-xl bg-primary/10 text-4xl font-bold text-primary shadow-md lg:size-32 lg:rounded-2xl">
            {name.charAt(0)}
          </span>
        )}

        <div className={cn("min-w-0", image && "lg:text-white")}>
          <h1 className="line-clamp-2 text-xl leading-tight font-bold tracking-[-0.015em] lg:text-4xl">
            {name}
          </h1>
          <p
            className={cn(
              "mt-1 line-clamp-2 text-sm leading-normal text-muted-foreground italic lg:text-base",
              image && "lg:text-white/90",
            )}
          >
            {description || `Discover products and services from ${name}.`}
          </p>
          <p
            className={cn(
              "mt-2 flex items-center gap-1 text-xs font-medium tracking-wider text-muted-foreground uppercase lg:text-sm",
              image && "lg:text-white/80",
            )}
          >
            <MapPin
              className="size-4 shrink-0 fill-primary text-primary [&_circle]:fill-white [&_circle]:stroke-white"
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="truncate">{location}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
