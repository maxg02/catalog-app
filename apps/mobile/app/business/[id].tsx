import { Input } from "@/components/ui/input";
import { ScrollView, View, Image } from "react-native";
import {
    SearchIcon,
    SlidersHorizontalIcon,
    MapPinIcon,
    CircleArrowLeftIcon,
    Share2Icon,
    ArrowDownUpIcon,
    LayoutGridIcon,
    LayoutListIcon,
} from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useState, useMemo } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ProductDto } from "interfaces";
import HeaderContainer from "@/components/layout/headerContainer";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import FeaturedProduct from "@/features/products/components/featuredProduct";
import ProductCard from "@/features/products/components/productCard";
import { SimpleGrid } from "react-native-super-grid";
import { testProducts as products, testBusinesses as businesses } from "@/lib/utils";

const featuredProducts: ProductDto[] = products.filter((p) => p.trending || p.bestSeller);

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
