import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Redirect, Tabs, useRouter } from "expo-router";
import { UserRole } from "@internal/interfaces";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import { cn, testUser } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CatalogProductCard from "@/features/catalog/components/catalogProductCard";
import { PlusIcon } from "lucide-nativewind";
import { useGetBusinessProductsQuery } from "@/features/catalog/api/catalogApi";

const BUSINESS_ID = 1;

function Catalog() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"all" | "public" | "draft">("all");

    const {
        data: products = [],
        isLoading: isProductsLoading,
        isError: isProductsError,
    } = useGetBusinessProductsQuery(BUSINESS_ID);

    const visibleProducts = useMemo(
        () =>
            activeTab === "all"
                ? products
                : products.filter((product) =>
                      activeTab === "public" ? product.isPublic : !product.isPublic,
                  ),
        [activeTab, products],
    );

    const scrollAmount = useScrollAmount("catalog");
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) {
                scrollAmount.value = event.contentOffset.y;
            }
        },
    });

    useEffect(() => {
        if (scrollAmount) {
            scrollAmount.value = 0;
        }

        return () => {
            if (scrollAmount) {
                scrollAmount.value = 0;
            }
        };
    }, [scrollAmount]);

    if (testUser.role === UserRole.Customer) {
        return <Redirect href="/" />;
    }

    return (
        <View className="bg-background flex-1">
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerClassName="pb-24"
                className="flex-1"
            >
                <Tabs.Screen options={{ title: "Catalog Management" }} />
                <View className="flex-row px-4 gap-3 border-b border-border">
                    <Button
                        className={cn(
                            "rounded-none px-0 h-14 w-24",
                            activeTab === "all" && "border-b-4 border-primary",
                        )}
                        variant={"ghost"}
                        onPress={() => setActiveTab("all")}
                    >
                        <Text
                            className={cn(
                                "font-jakarta-bold text-muted-foreground",
                                activeTab === "all" && "text-primary",
                            )}
                        >
                            All Items
                        </Text>
                    </Button>
                    <Button
                        className={cn(
                            "rounded-none px-0 h-14 w-24",
                            activeTab === "public" && "border-b-4 border-primary",
                        )}
                        variant={"ghost"}
                        onPress={() => setActiveTab("public")}
                    >
                        <Text
                            className={cn(
                                "font-jakarta-bold text-muted-foreground",
                                activeTab === "public" && "text-primary",
                            )}
                        >
                            Public
                        </Text>
                    </Button>
                    <Button
                        className={cn(
                            "rounded-none px-0 h-14 w-24",
                            activeTab === "draft" && "border-b-4 border-primary",
                        )}
                        variant={"ghost"}
                        onPress={() => setActiveTab("draft")}
                    >
                        <Text
                            className={cn(
                                "font-jakarta-bold text-muted-foreground",
                                activeTab === "draft" && "text-primary",
                            )}
                        >
                            Draft
                        </Text>
                    </Button>
                </View>
                <View className="px-6 py-4 gap-3">
                    {isProductsLoading || isProductsError ? (
                        <Text variant={"muted"}>
                            {isProductsError
                                ? "Unable to load products from the API."
                                : "Loading products..."}
                        </Text>
                    ) : visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => (
                            <CatalogProductCard key={product.id} {...product} />
                        ))
                    ) : (
                        <Text variant={"muted"}>No products found.</Text>
                    )}
                </View>
            </Animated.ScrollView>
            <Button
                size={"icon"}
                className="absolute bottom-6 right-6 h-16 w-16 rounded-full shadow-lg shadow-black/25"
                accessibilityLabel="Add new product"
                onPress={() => router.push("/catalog/add")}
            >
                <PlusIcon size={28} className="text-primary-foreground" />
            </Button>
        </View>
    );
}

export default Catalog;
