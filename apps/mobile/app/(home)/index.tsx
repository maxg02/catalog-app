import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import { Tabs, useRouter } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import CatalogProductCard from "@/features/catalog/components/catalogProductCard";
import { PlusIcon } from "lucide-nativewind";
import {
    useDeleteBusinessProductMutation,
    useGetBusinessProductsQuery,
} from "@/features/catalog/api/catalogApi";
import { useGetProfileQueryState } from "@/features/profile/api/profileApi";
import type { RootState } from "@/lib/store";

function Catalog() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"all" | "public" | "draft">("all");
    const {
        isLoading: isProfileLoading,
        isError: isProfileError,
    } = useGetProfileQueryState(undefined);
    const businessId = useSelector((state: RootState) => state.businessSelection.selectedBusinessId);

    const {
        data: products = [],
        isLoading: isProductsLoading,
        isFetching: isProductsFetching,
        isError: isProductsError,
        refetch: refetchProducts,
    } = useGetBusinessProductsQuery(businessId ?? 0, { skip: !businessId });
    const [deleteBusinessProduct, { isLoading: isDeletingProduct }] = useDeleteBusinessProductMutation();

    const visibleProducts = useMemo(
        () =>
            activeTab === "all"
                ? products
                : products.filter((product) =>
                      activeTab === "public" ? product.isPublic : !product.isPublic,
                  ),
        [activeTab, products],
    );

    const scrollAmount = useScrollAmount("index");
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) {
                scrollAmount.value = event.contentOffset.y;
            }
        },
    });

    const onRefresh = useCallback(() => {
        if (businessId) refetchProducts();
    }, [businessId, refetchProducts]);

    const deleteCatalogProduct = useCallback(
        (productId: number) => {
            if (!businessId) return Promise.reject(new Error("Missing business"));

            return deleteBusinessProduct({ businessId, productId }).unwrap();
        },
        [businessId, deleteBusinessProduct],
    );

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

    const isLoading = isProfileLoading || isProductsLoading;
    const isError = isProfileError || isProductsError;

    return (
        <View className="bg-background flex-1">
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerClassName="pb-24"
                className="flex-1"
                refreshControl={
                    <RefreshControl
                        refreshing={Boolean(businessId) && isProductsFetching && !isProductsLoading}
                        onRefresh={onRefresh}
                    />
                }
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
                    {isLoading || isError ? (
                        <Text variant={"muted"}>
                            {isError ? "Unable to load products from the API." : "Loading products..."}
                        </Text>
                    ) : !businessId ? (
                        <Text variant={"muted"}>Add a business before managing products.</Text>
                    ) : visibleProducts.length > 0 ? (
                        visibleProducts.map((product) => (
                            <CatalogProductCard
                                key={product.id}
                                {...product}
                                isDeleting={isDeletingProduct}
                                onDelete={() => deleteCatalogProduct(product.id)}
                            />
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
                disabled={!businessId}
                onPress={() => router.push("/catalog/add")}
            >
                <PlusIcon size={28} className="text-primary-foreground" />
            </Button>
            {isDeletingProduct && <LoadingOverlay label="Deleting product..." />}
        </View>
    );
}

export default Catalog;
