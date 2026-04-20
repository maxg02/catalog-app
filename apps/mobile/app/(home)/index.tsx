import { Input } from "@/components/ui/input";
import { ScrollView, View } from "react-native";
import {
    DumbbellIcon,
    SearchIcon,
    SlidersHorizontalIcon,
    UtensilsIcon,
    ShirtIcon,
    WrenchIcon,
    MapPinIcon,
    BellIcon,
} from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useState } from "react";
import { Stack } from "expo-router";
import BusinessCard from "@/components/ui/businessCard";
import { testBusinesses as businesses } from "@/lib/utils";
import HeaderContainer from "@/components/layout/headerContainer";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";

type activeCategory = "food" | "fashion" | "services" | "fitness";

export default function Index() {
    const [activeCategory, setActiveCategory] = useState<activeCategory | null>(null);
    const scrollAmount = useSharedValue<number>(0);

    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event: any) => {
            scrollAmount.value = event.contentOffset.y;
        },
    });

    return (
        <Animated.ScrollView
            contentContainerClassName="justify-center bg-background gap-6 py-3"
            onScroll={handleScroll}
            scrollEventThrottle={16}
        >
            <Stack.Screen
                options={{
                    header: () => (
                        <HeaderContainer scrollAmount={scrollAmount}>
                            <MapPinIcon className="text-primary" />
                            <View>
                                <Text className="text-xs text-muted-foreground font-jakarta-semibold">
                                    Your Location
                                </Text>
                                <Text className="font-jakarta-bold">Mandinga, Santo Domingo</Text>
                            </View>
                            <BellIcon className="ml-auto" />
                        </HeaderContainer>
                    ),
                }}
            />
            <View className="px-4 flex-row items-center gap-2">
                <View className="flex-1 flex-row items-center px-3 bg-input border border-transparent rounded-2xl overflow-hidden">
                    <SearchIcon size={20} className="text-muted-foreground/50" />
                    <Input placeholder="Buscar producto o servicio" className="flex-1" />
                </View>
                <Button className="h-12 w-12">
                    <SlidersHorizontalIcon className="text-primary-foreground" />
                </Button>
            </View>
            <ScrollView
                contentContainerClassName="px-4 flex justify-start flex-row gap-4"
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                <Button
                    variant={activeCategory === "food" ? "default" : "secondary"}
                    onPress={() => setActiveCategory("food")}
                >
                    <UtensilsIcon
                        size={17}
                        className={
                            activeCategory === "food"
                                ? "text-primary-foreground"
                                : "text-secondary-foreground"
                        }
                    />
                    <Text variant={"small"} className="font-jakarta-medium">
                        Food
                    </Text>
                </Button>
                <Button
                    variant={activeCategory === "fashion" ? "default" : "secondary"}
                    onPress={() => setActiveCategory("fashion")}
                >
                    <ShirtIcon
                        size={17}
                        className={
                            activeCategory === "fashion"
                                ? "text-primary-foreground"
                                : "text-secondary-foreground"
                        }
                    />
                    <Text variant={"small"}>Fashion</Text>
                </Button>
                <Button
                    variant={activeCategory === "services" ? "default" : "secondary"}
                    onPress={() => setActiveCategory("services")}
                >
                    <WrenchIcon
                        size={17}
                        className={
                            activeCategory === "services"
                                ? "text-primary-foreground"
                                : "text-secondary-foreground"
                        }
                    />
                    <Text variant={"small"}>Services</Text>
                </Button>
                <Button
                    variant={activeCategory === "fitness" ? "default" : "secondary"}
                    onPress={() => setActiveCategory("fitness")}
                >
                    <DumbbellIcon
                        size={17}
                        className={
                            activeCategory === "fitness"
                                ? "text-primary-foreground"
                                : "text-secondary-foreground"
                        }
                    />
                    <Text variant={"small"}>Fitness</Text>
                </Button>
            </ScrollView>
            <View className="px-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text variant={"h1"}>Discover Nearby</Text>
                    <Button variant={"link"}>
                        <Text variant={"small"} className="font-jakarta-semibold">
                            View All
                        </Text>
                    </Button>
                </View>
                <View className="gap-y-4 pb-6">
                    {businesses.map((b, key) => (
                        <BusinessCard key={key} {...b} />
                    ))}
                </View>
            </View>
        </Animated.ScrollView>
    );
}
