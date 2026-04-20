import React from "react";
import { View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "./button";
import { StarIcon } from "lucide-nativewind";
import { BusinessDto } from "interfaces";
import { BusinessCategories } from "enums";
import { Link } from "expo-router";
import { Badge } from "./badge";
import Card from "./card";

function BusinessCard(businessData: BusinessDto) {
    return (
        <Card>
            <View className="h-52 overflow-hidden relative">
                <Badge variant={"secondary"} className="absolute top-3 right-3 z-10">
                    <StarIcon className="fill-primary text-primary" size={15} />
                    <Text>{businessData.rating}</Text>
                </Badge>
                <Badge className="absolute bottom-3 left-3 z-10">
                    <Text className="text-primary-foreground text-xs font-jakarta-bold" variant={"small"}>
                        3.4 km
                    </Text>
                </Badge>
                <Image
                    source={{ uri: businessData.image }}
                    resizeMode="cover"
                    className="w-full h-full"
                />
            </View>
            <View className="py-4 px-6">
                <Text className="text-primary text-xs font-jakarta-bold" variant={"small"}>
                    {BusinessCategories[businessData.category]}
                </Text>
                <Text variant={"h2"}>{businessData.name}</Text>
                <View className="flex-row overflow-hidden gap-3 ">
                    <Text variant={"muted"} className="text-wrap flex-1" numberOfLines={2}>
                        {businessData.description}
                    </Text>
                    <Link href={{ pathname: "/business/[id]", params: { id: businessData.id } }} asChild>
                        <Button>
                            <Text>Catalog</Text>
                        </Button>
                    </Link>
                </View>
            </View>
        </Card>
    );
}

export default BusinessCard;
