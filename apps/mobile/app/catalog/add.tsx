import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import ProductForm, {
    type ProductFormSubmitValues,
    type ProductFormValues,
} from "@/features/catalog/components/productForm";
import { useCreateBusinessProductMutation } from "@/features/catalog/api/catalogApi";
import { useGetProfileQuery } from "@/features/profile/api/profileApi";
import type { RootState } from "@/lib/store";

const defaultValues: ProductFormValues = {
    name: "",
    price: "",
    description: "",
    details: [],
    onStock: true,
    isFeatured: false,
    visibility: "public",
    sale: false,
    salePrice: "",
    saleEndDate: null,
};

function AddProduct() {
    const router = useRouter();
    const { isLoading: isProfileLoading, isError: isProfileError } = useGetProfileQuery();
    const businessId = useSelector((state: RootState) => state.businessSelection.selectedBusinessId);
    const [createProduct, { isLoading }] = useCreateBusinessProductMutation();

    if (isProfileLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
                <ActivityIndicator size="large" />
                <Text variant="muted">Loading business...</Text>
            </View>
        );
    }

    if (isProfileError || !businessId) {
        return (
            <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
                <Text variant="h1" className="text-center">
                    No business found
                </Text>
                <Text variant="muted" className="text-center">
                    Add a business before creating products.
                </Text>
            </View>
        );
    }

    const onSubmit = async (product: ProductFormSubmitValues) => {
        await createProduct({ businessId, product }).unwrap();
        router.back();
    };

    return (
        <ProductForm
            defaultValues={defaultValues}
            submitLabel="Save Product"
            loadingLabel="Saving product..."
            isSaving={isLoading}
            onSubmit={onSubmit}
        />
    );
}

export default AddProduct;
