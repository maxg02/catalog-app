/* eslint-disable @next/next/no-img-element */
import { MapPin } from "lucide-react";

type BusinessSummaryProps = {
  name: string;
  description: string | null;
  image: string | null;
  location: string;
};

export function BusinessSummary({ name, description, image, location }: BusinessSummaryProps) {
  return (
    <section className="flex p-4 pb-2" aria-label="Business details">
      <div className="flex w-full items-center gap-4">
        {image ? (
          <img
            className="size-24 shrink-0 rounded-xl object-cover shadow-md"
            src={image}
            alt={`${name} showroom`}
            fetchPriority="high"
          />
        ) : (
          <span className="grid size-24 shrink-0 place-items-center rounded-xl bg-primary/10 text-4xl font-bold text-primary shadow-md">
            {name.charAt(0)}
          </span>
        )}

        <div className="min-w-0">
          <h1 className="line-clamp-2 text-xl leading-tight font-bold tracking-[-0.015em]">
            {name}
          </h1>
          <p className="mt-1 line-clamp-2 text-sm leading-normal text-muted-foreground italic">
            {description || `Discover products and services from ${name}.`}
          </p>
          <p className="mt-2 flex items-center gap-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
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
