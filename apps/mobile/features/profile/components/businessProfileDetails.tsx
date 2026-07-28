import React from "react";
import { View } from "react-native";
import { InfoIcon, MapPinIcon } from "lucide-nativewind";
import Card from "@/components/ui/card";
import IconCircle from "@/components/ui/iconCircle";
import TagIcon from "@/components/icons/tagIcon";
import { Text } from "@/components/ui/text";
import { formatBusinessCategory } from "@/features/profile/lib/formatBusinessCategory";
import type { BusinessProfileDto } from "@internal/interfaces";

type BusinessProfileDetailsProps = {
    business?: BusinessProfileDto;
};

function BusinessProfileDetails({ business }: BusinessProfileDetailsProps) {
    const location = business?.location;
    const locationLabel = location
        ? [location.city, location.country].filter(Boolean).join(", ")
        : "Location not set";

    return (
        <View className="gap-6">
            <Card className="gap-4 px-5 py-5">
                <View className="flex-row items-center gap-3">
                    <IconCircle icon={InfoIcon} />
                    <Text variant={"h3"}>About Business</Text>
                </View>
                <Text variant={"muted"} className="leading-6">
                    {business
                        ? business.description || "No business description added."
                        : "Select a business to view its description."}
                </Text>
                {business ? (
                    <View className="flex-row gap-2 items-center">
                        <TagIcon className="text-primary" size={20} />
                        <Text className="uppercase text-primary">
                            {formatBusinessCategory(business.category)}
                        </Text>
                    </View>
                ) : (
                    <Text variant="muted" className="text-xs">
                        No business selected.
                    </Text>
                )}
            </Card>

            <Card className="gap-4 px-5 py-5">
                <View className="flex-row items-center gap-3">
                    <IconCircle icon={MapPinIcon} />
                    <Text variant={"h3"}>Location</Text>
                </View>
                <View className="gap-1">
                    <Text>
                        {business
                            ? location?.address || "No business location added"
                            : "Select a business to view its location."}
                    </Text>
                    <Text variant={"muted"} className="text-xs">
                        {business
                            ? location
                                ? locationLabel
                                : "Add one from Manage Account when you are ready."
                            : "Business location will appear here."}
                    </Text>
                </View>
            </Card>
        </View>
    );
}

export default BusinessProfileDetails;
export type { BusinessProfileDetailsProps };
