import { Input } from "@/components/ui/input";
import { ScrollView, View, Image } from "react-native";
import {
    DumbbellIcon,
    SearchIcon,
    SlidersHorizontalIcon,
    UtensilsIcon,
    ShirtIcon,
    WrenchIcon,
    MapPinIcon,
    BellIcon,
    CircleArrowLeftIcon,
    Share2Icon,
    ArrowDownUpIcon,
    LayoutGridIcon,
    LayoutListIcon,
} from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useState, useMemo } from "react";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import BusinessCard from "@/components/ui/businessCard";
import { BusinessDto, ProductDto } from "interfaces";
import { BusinessCategories } from "enums";
import HeaderContainer from "@/components/layout/headerContainer";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import FeaturedProduct from "@/components/ui/featuredProduct";
import ProductCard from "@/components/ui/productCard";
import { SimpleGrid } from "react-native-super-grid";
import { testProducts as products } from "@/lib/utils";

const featuredProducts: ProductDto[] = products.filter((p) => p.trending || p.bestSeller);

const testImageUrl = "https://foodtank.com/wp-content/uploads/2021/09/gemma-stpjHJGqZyw-unsplash.jpg";

const businesses: BusinessDto[] = [
    {
        id: 1,
        name: "Café Aroma",
        category: BusinessCategories.FOOD,
        location: "placeholder",
        rating: 4.5,
        image: testImageUrl,
        description: "Cafetería acogedora con una gran variedad de cafés artesanales.",
    },
    {
        id: 2,
        name: "TechZone",
        category: BusinessCategories.TECH,
        location: "placeholder",
        rating: 4.2,
        image: testImageUrl,
        description: "Tienda especializada en dispositivos electrónicos y accesorios.",
    },
    {
        id: 3,
        name: "FitLife Gym",
        category: BusinessCategories.FITNESS,
        location: "placeholder",
        rating: 4.7,
        image: testImageUrl,
        description: "Gimnasio moderno con entrenadores certificados y equipos de última generación.",
    },
    {
        id: 4,
        name: "Green Market",
        category: BusinessCategories.GROCERY,
        location: "placeholder",
        rating: 4.3,
        image: testImageUrl,
        description: "Supermercado con productos orgánicos y frescos.",
    },
    {
        id: 5,
        name: "Bella Moda",
        category: BusinessCategories.FASHION,
        location: "placeholder",
        rating: 4.1,
        image: testImageUrl,
        description: "Boutique de ropa moderna para todas las edades.",
    },
    {
        id: 6,
        name: "AutoCare Service",
        category: BusinessCategories.AUTOMOTIVE,
        location: "placeholder",
        rating: 4.6,
        image: testImageUrl,
        description: "Centro de mantenimiento y reparación de vehículos.",
    },
    {
        id: 7,
        name: "Book Haven",
        category: BusinessCategories.BOOKSTORE,
        location: "placeholder",
        rating: 4.8,
        image: testImageUrl,
        description: "Librería con una amplia colección de libros y ambiente tranquilo.",
    },
    {
        id: 8,
        name: "Pet World",
        category: BusinessCategories.PETS,
        location: "placeholder",
        rating: 4.4,
        image: testImageUrl,
        description: "Tienda especializada en productos y cuidado para mascotas.",
    },
    {
        id: 9,
        name: "Spa Relax",
        category: BusinessCategories.BEAUTY,
        location: "placeholder",
        rating: 4.9,
        image: testImageUrl,
        description: "Centro de spa con servicios de relajación y cuidado personal.",
    },
    {
        id: 10,
        name: "QuickBites",
        category: BusinessCategories.FOOD,
        location: "placeholder",
        rating: 4.0,
        image: testImageUrl,
        description: "Restaurante de comida rápida con opciones variadas y económicas.",
    },
];

export default function BusinessPage() {
    const [listDisplay, setListDisplay] = useState(false);
    const router = useRouter();
    const scrollAmount = useSharedValue<number>(0);
    const { id } = useLocalSearchParams();

    const selectedBusiness = useMemo(() => {
        return businesses.find((b) => b.id === Number(id));
    }, [id]);

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
                            <Button variant={"ghost"} size={"icon"} onPress={() => router.back()}>
                                <CircleArrowLeftIcon size={30} />
                            </Button>
                            <View>
                                <Text className="font-jakarta-bold">{selectedBusiness?.name}</Text>
                            </View>
                            <Share2Icon className="ml-auto text-primary" />
                        </HeaderContainer>
                    ),
                }}
            />
            <View className="flex-row px-4 gap-4">
                <View className="h-28 w-28 border border-transparent rounded-2xl overflow-hidden">
                    <Image
                        source={{ uri: selectedBusiness?.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>
                <View className="items-start flex-1 justify-between">
                    <Text variant={"h1"}>{selectedBusiness?.name}</Text>
                    <Text variant={"muted"} className="text-wrap">
                        {selectedBusiness?.description}
                    </Text>
                    <View className="flex-row items-center gap-1">
                        <MapPinIcon className="text-primary" size={15} />
                        <Text variant={"muted"}>SANTO DOMINGO, DR</Text>
                    </View>
                </View>
            </View>
            <View className="px-4 flex-row items-center gap-2">
                <View className="flex-1 flex-row items-center px-3 py-1 bg-input border border-transparent rounded-2xl overflow-hidden">
                    <SearchIcon size={20} className="text-muted-foreground/50" />
                    <Input placeholder="Buscar producto o servicio" className="flex-1 border-0" />
                </View>
                <Button className="h-12 w-12">
                    <SlidersHorizontalIcon className="text-primary-foreground" />
                </Button>
            </View>
            <View className="px-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text variant={"h1"}>Featured Collection</Text>
                    <Button variant={"link"}>
                        <Text variant={"small"} className="font-jakarta-semibold">
                            View All
                        </Text>
                    </Button>
                </View>
                <ScrollView
                    contentContainerClassName="flex justify-start flex-row gap-4"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                >
                    {featuredProducts.map((fp, key) => (
                        <FeaturedProduct key={key} {...fp} />
                    ))}
                </ScrollView>
            </View>
            <View>
                <View className="flex-row items-center mb-2 px-4">
                    <Text variant={"h1"}>Product Catalog</Text>
                    <Button variant={"secondary"} className="ml-auto mr-3">
                        <ArrowDownUpIcon className="text-muted-foreground" size={20} />
                        <Text variant={"muted"} className="font-jakarta-semibold text-muted-foreground">
                            Newest
                        </Text>
                    </Button>
                    <Button
                        variant={"secondary"}
                        size={"icon"}
                        onPress={() => setListDisplay((prev) => !prev)}
                    >
                        {listDisplay ? (
                            <LayoutListIcon className="text-muted-foreground" size={20} />
                        ) : (
                            <LayoutGridIcon className="text-muted-foreground" size={20} />
                        )}
                    </Button>
                </View>
                <SimpleGrid
                    data={products}
                    renderItem={({ item }) => <ProductCard horizontal={listDisplay} {...item} />}
                    listKey={1}
                    spacing={15}
                    maxItemsPerRow={listDisplay ? 1 : 2}
                />
            </View>
        </Animated.ScrollView>
    );
}
