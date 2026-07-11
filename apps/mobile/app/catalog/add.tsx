import React from "react";
import { useRouter } from "expo-router";
import ProductForm, {
    type ProductFormSubmitValues,
    type ProductFormValues,
} from "@/features/catalog/components/productForm";
import { useCreateBusinessProductMutation } from "@/features/catalog/api/catalogApi";

const BUSINESS_ID = 1;

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
    const [createProduct, { isLoading }] = useCreateBusinessProductMutation();

    const onSubmit = async (product: ProductFormSubmitValues) => {
        await createProduct({ businessId: BUSINESS_ID, product }).unwrap();
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