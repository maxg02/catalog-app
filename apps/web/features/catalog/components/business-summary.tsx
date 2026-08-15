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
            className="relative flex scroll-mt-20 p-4 pb-2 min-[40rem]:h-[clamp(15rem,31vw,20rem)] min-[40rem]:overflow-hidden min-[40rem]:rounded-[clamp(1.5rem,3vw,2rem)] min-[40rem]:bg-surface-container-low min-[40rem]:p-0 min-[40rem]:shadow-ambient-raised"
            aria-label="Business details"
        >
            {image && (
                <>
                    <img
                        className="absolute inset-0 hidden size-full object-cover min-[40rem]:block"
                        src={image}
                        alt=""
                        aria-hidden="true"
                    />
                    <div
                        className="absolute inset-0 hidden bg-linear-to-t from-black/80 via-black/20 to-transparent min-[40rem]:block"
                        aria-hidden="true"
                    />
                </>
            )}

            <div className="relative flex w-full items-center gap-[clamp(1rem,2.5vw,1.5rem)] min-[40rem]:items-end min-[40rem]:p-[clamp(1.5rem,4vw,2.5rem)]">
                {image ? (
                    <img
                        className="size-24 shrink-0 rounded-xl object-cover shadow-md min-[40rem]:size-[clamp(6rem,12vw,8rem)] min-[40rem]:rounded-2xl min-[40rem]:border-4 min-[40rem]:border-white/20 min-[40rem]:bg-card min-[40rem]:shadow-ambient-raised"
                        src={image}
                        alt={`${name} showroom`}
                        fetchPriority="high"
                    />
                ) : (
                    <span className="grid size-24 shrink-0 place-items-center rounded-xl bg-primary/10 text-4xl font-bold text-primary shadow-md min-[40rem]:size-[clamp(6rem,12vw,8rem)] min-[40rem]:rounded-2xl">
                        {name.charAt(0)}
                    </span>
                )}

                <div className={cn("min-w-0", image && "min-[40rem]:text-white")}>
                    <h1 className="line-clamp-2 text-[clamp(1.25rem,3.5vw,2.25rem)] leading-tight font-bold tracking-[-0.015em]">
                        {name}
                    </h1>
                    <p
                        className={cn(
                            "mt-1 line-clamp-2 text-[clamp(0.875rem,1.8vw,1rem)] leading-normal text-muted-foreground italic",
                            image && "min-[40rem]:text-white/90",
                        )}
                    >
                        {description || `Discover products and services from ${name}.`}
                    </p>
                    <p
                        className={cn(
                            "mt-2 flex items-center gap-1 text-[clamp(0.75rem,1.6vw,0.875rem)] font-medium tracking-wider text-muted-foreground uppercase",
                            image && "min-[40rem]:text-white/80",
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
