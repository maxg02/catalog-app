import React, { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { ProductDto } from "@internal/interfaces";
import { ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import ProductForm, {
    type ProductFormSubmitValues,
    type ProductFormValues,
} from "@/features/catalog/components/productForm";
import { useGetProductQuery, useUpdateBusinessProductMutation } from "@/features/catalog/api/catalogApi";
import type { ProductImageAsset } from "@/features/catalog/components/productMediaUpload";

const BUSINESS_ID = 1;

function getDefaultValues(product: ProductDto): ProductFormValues {
    return {
        name: product.name,
        price: String(product.price),
        description: product.description,
        details: Object.entries(product.details).map(([title, description]) => ({ title, description })),
        onStock: product.onStock,
        isFeatured: product.isFeatured,
        visibility: product.isPublic ? "public" : "draft",
        sale: product.sale,
        salePrice: product.salePrice == null ? "" : String(product.salePrice),
        saleEndDate: product.saleEndDate ? new Date(product.saleEndDate) : null,
    };
}

function getProductImages(product: ProductDto): ProductImageAsset[] {
    return product.image.map((uri, index) => ({
        uri,
        name: `product-image-${index + 1}.jpg`,
        type: "image/jpeg",
        isExisting: true,
    }));
}

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
    const defaultValues = useMemo(() => (product ? getDefaultValues(product) : null), [product]);
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
        await updateProduct({ businessId: BUSINESS_ID, productId, product: nextProduct }).unwrap();
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
