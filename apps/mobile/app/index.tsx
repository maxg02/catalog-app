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
import BusinessCard from "@/components/businessCard";
import { BusinessDto } from "interfaces";
import { BusinessCategories } from "enums";
import HeaderContainer from "@/components/layout/headerContainer";
import Animated, {
    useAnimatedProps,
    useAnimatedScrollHandler,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

type activeCategory = "food" | "fashion" | "services" | "fitness";

const businesses: BusinessDto[] = [
    {
        name: "Café Aroma",
        category: BusinessCategories.FOOD,
        location: "placeholder",
        rating: 4.5,
        image: "placeholder",
        description: "Cafetería acogedora con una gran variedad de cafés artesanales.",
    },
    {
        name: "TechZone",
        category: BusinessCategories.TECH,
        location: "placeholder",
        rating: 4.2,
        image: "placeholder",
        description: "Tienda especializada en dispositivos electrónicos y accesorios.",
    },
    {
        name: "FitLife Gym",
        category: BusinessCategories.FITNESS,
        location: "placeholder",
        rating: 4.7,
        image: "placeholder",
        description: "Gimnasio moderno con entrenadores certificados y equipos de última generación.",
    },
    {
        name: "Green Market",
        category: BusinessCategories.GROCERY,
        location: "placeholder",
        rating: 4.3,
        image: "placeholder",
        description: "Supermercado con productos orgánicos y frescos.",
    },
    {
        name: "Bella Moda",
        category: BusinessCategories.FASHION,
        location: "placeholder",
        rating: 4.1,
        image: "placeholder",
        description: "Boutique de ropa moderna para todas las edades.",
    },
    {
        name: "AutoCare Service",
        category: BusinessCategories.AUTOMOTIVE,
        location: "placeholder",
        rating: 4.6,
        image: "placeholder",
        description: "Centro de mantenimiento y reparación de vehículos.",
    },
    {
        name: "Book Haven",
        category: BusinessCategories.BOOKSTORE,
        location: "placeholder",
        rating: 4.8,
        image: "placeholder",
        description: "Librería con una amplia colección de libros y ambiente tranquilo.",
    },
    {
        name: "Pet World",
        category: BusinessCategories.PETS,
        location: "placeholder",
        rating: 4.4,
        image: "placeholder",
        description: "Tienda especializada en productos y cuidado para mascotas.",
    },
    {
        name: "Spa Relax",
        category: BusinessCategories.BEAUTY,
        location: "placeholder",
        rating: 4.9,
        image: "placeholder",
        description: "Centro de spa con servicios de relajación y cuidado personal.",
    },
    {
        name: "QuickBites",
        category: BusinessCategories.FOOD,
        location: "placeholder",
        rating: 4.0,
        image: "placeholder",
        description: "Restaurante de comida rápida con opciones variadas y económicas.",
    },
];

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
                <View className="flex-1 flex-row items-center px-3 py-1 bg-input border border-transparent rounded-2xl overflow-hidden">
                    <SearchIcon size={20} className="text-muted-foreground/50" />
                    <Input placeholder="Buscar producto o servicio" className="flex-1 border-0" />
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
