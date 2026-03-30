import React from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "./ui/button";
import { StarIcon } from "lucide-nativewind";
import { BusinessDto } from "interfaces";
import { BusinessCategories } from "enums";

const testImageUrl = "https://foodtank.com/wp-content/uploads/2021/09/gemma-stpjHJGqZyw-unsplash.jpg";

function BusinessCard(businessData: BusinessDto) {
    return (
        <View className="border border-transparent rounded-3xl overflow-hidden bg-card shadow-black shadow-sm">
            <View className="h-56 overflow-hidden relative">
                <View className="absolute top-3 right-3 z-10 bg-secondary px-2 py-1 rounded-full flex-row items-center gap-[0.4rem]">
                    <StarIcon className="fill-primary text-primary" size={15} />
                    <Text
                        className="text-secondary-foreground text-xs font-jakarta-bold"
                        variant={"small"}
                    >
                        {businessData.rating}
                    </Text>
                </View>
                <View className="absolute bottom-3 left-3 z-10 bg-primary px-2 py-1 rounded-full flex-row items-center gap-[0.4rem]">
                    <Text className="text-primary-foreground text-xs font-jakarta-bold" variant={"small"}>
                        3.4 km
                    </Text>
                </View>
                <Image source={{ uri: testImageUrl }} resizeMode="cover" className="w-full h-full" />
            </View>
            <View className="p-4">
                <Text className="text-primary text-xs font-jakarta-bold" variant={"small"}>
                    {BusinessCategories[businessData.category]}
                </Text>
                <Text variant={"h2"}>{businessData.name}</Text>
                <View className="flex-row overflow-hidden gap-3 ">
                    <Text variant={"muted"} className="text-wrap flex-1">
                        {businessData.description}
                    </Text>
                    <Button>
                        <Text>Catalog</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}

export default BusinessCard;
