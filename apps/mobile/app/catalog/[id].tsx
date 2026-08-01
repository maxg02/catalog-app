import React, { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import ProductForm from "@/features/catalog/components/productForm";
import { getProductFormValues, getProductImages, type ProductFormSubmitValues } from "@/features/catalog/lib/productLogic";
import { useGetProductQuery, useUpdateBusinessProductMutation } from "@/features/catalog/api/catalogApi";

function EditProduct() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const productId = Number(id);
    const isValidProductId = Number.isInteger(productId) && productId > 0;
    const {
        data: product,
        isLoading: isProductLoading,
        isError: isProductError,
        refetch,
    } = useGetProductQuery(productId, { skip: !isValidProductId });
    const [updateProduct, { isLoading: isUpdatingProduct }] = useUpdateBusinessProductMutation();
    const defaultValues = useMemo(() => (product ? getProductFormValues(product) : null), [product]);
    const defaultImages = useMemo(() => (product ? getProductImages(product) : []), [product]);

    if (!isValidProductId) {
        return (
            <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
                <Text variant="h1" className="text-center">
                    Product not found
                </Text>
                <Text variant="muted" className="text-center">
                    This product may have been removed from your catalog.
                </Text>
            </View>
        );
    }

    if (isProductLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
                <ActivityIndicator size="large" />
                <Text variant="muted">Loading product...</Text>
            </View>
        );
    }

    if (isProductError || !product || !defaultValues) {
        return (
            <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
                <Text variant="h1" className="text-center">
                    Product not found
                </Text>
                <Text variant="muted" className="text-center" onPress={() => refetch()}>
                    Tap to retry.
                </Text>
            </View>
        );
    }

    const onSubmit = async (nextProduct: ProductFormSubmitValues) => {
        await updateProduct({ businessId: product.businessId, productId, product: nextProduct }).unwrap();
        router.back();
    };

    return (
        <ProductForm
            defaultValues={defaultValues}
            defaultImages={defaultImages}
            defaultMainImageIndex={defaultImages.length > 0 ? 0 : null}
            submitLabel="Update Product"
            loadingLabel="Updating product..."
            showSaleFields
            isSaving={isUpdatingProduct}
            onSubmit={onSubmit}
        />
    );
}

export default EditProduct;
