import React from "react";
import { View } from "react-native";
import { MapPinIcon, SearchIcon } from "lucide-nativewind";
import Card from "@/components/ui/card";
import IconCircle from "@/components/ui/iconCircle";
import { IconInput } from "@/components/ui/iconInput";
import { Text } from "@/components/ui/text";
import type { BusinessLocationDto } from "@internal/interfaces";

type BusinessLocationCardProps = {
    location: BusinessLocationDto;
};

function BusinessLocationCard({ location }: BusinessLocationCardProps) {
    const locationLabel = [location.city, location.country].filter(Boolean).join(", ");

    return (
        <Card className="gap-4 px-5 py-5">
            <View className="flex-row items-start gap-3">
                <IconCircle icon={MapPinIcon} />
                <View className="flex-1 gap-1">
                    <Text variant={"h3"}>Business Location</Text>
                    <Text variant={"muted"} className="text-xs leading-5">
                        Your physical headquarters or service areas.
                    </Text>
                </View>
            </View>

            <IconInput
                icon={SearchIcon}
                defaultValue={location.address}
                placeholder="Search for your address..."
                iconSize={18}
                inputClassName="text-sm"
            />

            <View className="h-44 overflow-hidden rounded-2xl bg-secondary">
                <View className="absolute left-0 top-0 h-full w-16 bg-card/70" />
                <View className="absolute left-4 top-4 h-2 w-10 rounded-full bg-muted" />
                <View className="absolute left-4 top-9 h-2 w-8 rounded-full bg-muted" />
                <View className="absolute left-4 top-14 h-2 w-11 rounded-full bg-muted" />
                <View className="absolute inset-y-0 left-16 w-px bg-card" />
                <View className="absolute left-20 top-10 h-16 w-44 -rotate-12 rounded-full bg-card/60" />
                <View className="absolute left-20 top-28 h-8 w-56 rotate-6 rounded-full bg-card/70" />
                <View className="absolute right-2 top-4 h-24 w-24 rounded-full bg-card/50" />
                <View className="absolute left-1/2 top-14 -ml-5 items-center">
                    <IconCircle
                        icon={MapPinIcon}
                        className="h-11 w-11 bg-primary"
                        iconClassName="text-primary-foreground"
                    />
                </View>
                <View className="absolute bottom-4 left-4 rounded bg-card px-3 py-2 shadow-sm shadow-black/10">
                    <Text className="text-xs font-jakarta-extrabold uppercase" numberOfLines={1}>
                        {locationLabel}
                    </Text>
                </View>
            </View>
        </Card>
    );
}

export default BusinessLocationCard;
export type { BusinessLocationCardProps };
