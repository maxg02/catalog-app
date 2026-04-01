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
} from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useState, useMemo } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import BusinessCard from "@/components/ui/businessCard";
import { BusinessDto, ProductDto } from "interfaces";
import { BusinessCategories } from "enums";
import HeaderContainer from "@/components/layout/headerContainer";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import FeaturedProduct from "@/components/ui/featuredProduct";
import ProductCard from "@/components/ui/productCard";

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

const featuredProducts: ProductDto[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 89.99,
        image: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/413_lifestyle.png?v=1752737623&width=400",
        description: "High-quality wireless headphones with noise cancellation.",
        trending: true,
        BestSeller: true,
        Sale: false,
        SalePrice: null,
        Stock: 10,
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 129.5,
        image: "https://cdn.mos.cms.futurecdn.net/FkGweMeB7hdPgaSFQdgsfj-2000-80.jpg",
        description: "Track your fitness and notifications with this sleek smartwatch.",
        trending: true,
        BestSeller: false,
        Sale: false,
        SalePrice: null,
        Stock: 5,
    },
    {
        id: 3,
        name: "Gaming Mouse",
        price: 45.0,
        image: "https://assetsio.gnwcdn.com/g502x_f9QuuM8.jpeg?width=690&quality=85&format=jpg&dpr=3&auto=webp",
        description: "Ergonomic gaming mouse with customizable RGB lighting.",
        trending: false,
        BestSeller: true,
        Sale: true,
        SalePrice: 35.0,
        Stock: 20,
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        price: 59.99,
        image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9130.jpg?width=2048&quality=60&crop=2048:1365&auto=webp",
        description: "Portable speaker with powerful sound and long battery life.",
        trending: false,
        BestSeller: false,
        Sale: true,
        SalePrice: 49.99,
        Stock: 15,
    },
];

export const products: ProductDto[] = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        image: "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/413_lifestyle.png?v=1752737623&width=400",
        description: "High-quality wireless headphones with noise cancellation.",
        trending: true,
        BestSeller: true,
        Sale: false,
        SalePrice: null,
        Stock: 25,
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 149.99,
        image: "https://cdn.mos.cms.futurecdn.net/FkGweMeB7hdPgaSFQdgsfj-2000-80.jpg",
        description: "Track your fitness and notifications with this sleek smartwatch.",
        trending: true,
        BestSeller: false,
        Sale: true,
        SalePrice: 119.99,
        Stock: 40,
    },
    {
        id: 3,
        name: "Gaming Mouse",
        price: 59.99,
        image: "https://assetsio.gnwcdn.com/g502x_f9QuuM8.jpeg?width=690&quality=85&format=jpg&dpr=3&auto=webp",
        description: "Ergonomic gaming mouse with customizable RGB lighting.",
        trending: false,
        BestSeller: true,
        Sale: false,
        SalePrice: null,
        Stock: 60,
    },
    {
        id: 4,
        name: "Mechanical Keyboard",
        price: 129.99,
        image: "https://images.indianexpress.com/2021/06/Corsair-Mechanical-Keyboard.jpg",
        description: "Mechanical keyboard with blue switches for tactile feedback.",
        trending: true,
        BestSeller: true,
        Sale: true,
        SalePrice: 99.99,
        Stock: 35,
    },
    {
        id: 5,
        name: "4K Monitor",
        price: 399.99,
        image: "https://m.media-amazon.com/images/S/aplus-media-library-service-media/85fa4d9d-eeff-4d9c-be6b-e9c71df5d317.__CR0,0,1200,900_PT0_SX600_V1___.jpg",
        description: "Ultra HD 4K monitor for stunning visuals and productivity.",
        trending: false,
        BestSeller: false,
        Sale: true,
        SalePrice: 349.99,
        Stock: 20,
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        price: 79.99,
        image: "https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9130.jpg?width=2048&quality=60&crop=2048:1365&auto=webp",
        description: "Portable speaker with deep bass and long battery life.",
        trending: true,
        BestSeller: false,
        Sale: false,
        SalePrice: null,
        Stock: 50,
    },
    {
        id: 7,
        name: "Laptop Stand",
        price: 39.99,
        image: "https://callmateindia.com/cdn/shop/files/Black_1_8a97d0c4-b31e-4874-988b-f8eb9bf7703f.jpg?v=1721391709&width=2048",
        description: "Adjustable aluminum laptop stand for better ergonomics.",
        trending: false,
        BestSeller: true,
        Sale: true,
        SalePrice: 29.99,
        Stock: 70,
    },
];

export default function BusinessPage() {
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
            <View className="px-4">
                <View className="flex-row justify-between items-center mb-2">
                    <Text variant={"h1"}>Product Catalog</Text>
                    <Button variant={"secondary"}>
                        <Text variant={"muted"} className="text-muted-foreground">
                            Sort by:{" "}
                            <Text
                                variant={"muted"}
                                className="font-jakarta-semibold text-muted-foreground"
                            >
                                Newest
                            </Text>
                        </Text>
                    </Button>
                </View>
                <View className="grid grid-cols-2 gap-4">
                    {products.map((p, key) => (
                        <ProductCard key={key} {...p} />
                    ))}
                </View>
            </View>
        </Animated.ScrollView>
    );
}
