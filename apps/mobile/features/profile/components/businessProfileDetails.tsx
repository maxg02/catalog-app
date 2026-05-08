import React from "react";
import { View } from "react-native";
import { InfoIcon, MapPinIcon } from "lucide-nativewind";
import Card from "@/components/ui/card";
import IconCircle from "@/components/ui/iconCircle";
import { Text } from "@/components/ui/text";
import { formatBusinessCategory } from "@/features/profile/lib/formatBusinessCategory";
import type { UserBusinessDto } from "interfaces";

type BusinessProfileDetailsProps = {
    business: UserBusinessDto;
};

function BusinessProfileDetails({ business }: BusinessProfileDetailsProps) {
    const { location } = business;
    const locationLabel = [location.city, location.country].filter(Boolean).join(", ");

    return (
        <View className="gap-6">
            <Card className="gap-4 px-5 py-5">
                <View className="flex-row items-center gap-3">
                    <IconCircle icon={InfoIcon} />
                    <Text variant={"h3"}>About Business</Text>
                </View>
                <Text variant={"muted"} className="leading-6">
                    {business.description}
                </Text>
                <View className="self-start rounded-full bg-primary/10 px-3 py-2">
                    <Text className="text-xs font-jakarta-extrabold uppercase text-primary">
                        {formatBusinessCategory(business.category)}
                    </Text>
                </View>
            </Card>

            <Card className="gap-4 px-5 py-5">
                <View className="flex-row items-center gap-3">
                    <IconCircle icon={MapPinIcon} />
                    <Text variant={"h3"}>Location</Text>
                </View>
                <View className="h-40 overflow-hidden rounded-2xl bg-secondary">
                    <View className="absolute inset-x-0 top-5 h-12 -rotate-12 bg-card/70" />
                    <View className="absolute inset-x-4 top-20 h-8 rotate-12 bg-card/60" />
                    <View className="absolute -left-8 bottom-6 h-10 w-56 -rotate-12 rounded-full bg-primary/10" />
                    <View className="absolute right-0 top-0 h-full w-24 bg-primary/10" />
                    <View className="absolute left-1/2 top-12 -ml-4 items-center">
                        <MapPinIcon size={36} className="text-primary" />
                    </View>
                    <View className="absolute bottom-4 left-4 rounded-full bg-card px-3 py-2 shadow-sm shadow-black/10">
                        <Text className="text-xs font-jakarta-extrabold">{locationLabel}</Text>
                    </View>
                </View>
                <Text variant={"muted"} className="text-xs">
                    {location.address}
                </Text>
            </Card>
        </View>
    );
}

export default BusinessProfileDetails;
export type { BusinessProfileDetailsProps };
