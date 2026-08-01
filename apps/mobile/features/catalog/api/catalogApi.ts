import type { CatalogProductDto, ProductDto } from "@internal/interfaces";
import type { ProductImageAsset } from "@/features/catalog/lib/productLogic";
import { baseApi } from "@/lib/api/baseApi";

type ProductMutationPayload = {
    name: string;
    price: number;
    description: string;
    details: Record<string, string>;
    isPublic: boolean;
    onStock: boolean;
    isFeatured: boolean;
    sale?: boolean;
    salePrice?: number | null;
    saleEndDate?: string | null;
    images: ProductImageAsset[];
    mainImageIndex: number | null;
};

type CreateBusinessProductRequest = {
    businessId: number;
    product: ProductMutationPayload;
};

type UpdateBusinessProductRequest = {
    businessId: number;
    productId: number;
    product: ProductMutationPayload;
};

type DeleteBusinessProductRequest = {
    businessId: number;
    productId: number;
};

export function getProductFormData(product: ProductMutationPayload, options: { includeExistingImages: boolean }) {
    const formData = new FormData();
    const existingImages = options.includeExistingImages
        ? product.images.filter((image) => image.isExisting).map((image) => image.uri)
        : [];

    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("description", product.description);
    formData.append("details", JSON.stringify(product.details));
    formData.append("isPublic", String(product.isPublic));
    formData.append("onStock", String(product.onStock));
    formData.append("isFeatured", String(product.isFeatured));
    formData.append("sale", String(product.sale ?? false));
    formData.append("salePrice", product.salePrice == null ? "" : String(product.salePrice));
    formData.append("saleEndDate", product.saleEndDate ?? "");
    formData.append("existingImages", JSON.stringify(existingImages));
    formData.append("mainImageIndex", String(product.mainImageIndex ?? 0));

    product.images
        .filter((image) => !image.isExisting)
        .forEach((image) => {
            formData.append("images", {
                uri: image.uri,
                name: image.name,
                type: image.type,
            } as unknown as Blob);
        });

    return formData;
}

const catalogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBusinessProducts: builder.query<CatalogProductDto[], number>({
            query: (businessId) => `/api/business/${businessId}/products`,
            providesTags: (_result, _error, businessId) => [
                { type: "BusinessProducts", id: businessId },
            ],
        }),
        getProduct: builder.query<ProductDto, number>({
            query: (productId) => `/api/products/${productId}`,
            providesTags: (_result, _error, productId) => [{ type: "Product", id: productId }],
        }),
        createBusinessProduct: builder.mutation<ProductDto, CreateBusinessProductRequest>({
            query: ({ businessId, product }) => ({
                url: `/api/business/${businessId}/products`,
                method: "POST",
                body: getProductFormData(product, { includeExistingImages: false }),
            }),
            invalidatesTags: (result, _error, { businessId }) =>
                result ? [{ type: "BusinessProducts", id: businessId }] : [],
        }),
        updateBusinessProduct: builder.mutation<ProductDto, UpdateBusinessProductRequest>({
            query: ({ productId, product }) => ({
                url: `/api/products/${productId}`,
                method: "PUT",
                body: getProductFormData(product, { includeExistingImages: true }),
            }),
            invalidatesTags: (result, _error, { businessId, productId }) =>
                result
                    ? [
                          { type: "BusinessProducts", id: businessId },
                          { type: "Product", id: productId },
                      ]
                    : [],
        }),
        deleteBusinessProduct: builder.mutation<void, DeleteBusinessProductRequest>({
            query: ({ productId }) => ({
                url: `/api/products/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, error, { businessId, productId }) =>
                !error
                    ? [
                          { type: "BusinessProducts", id: businessId },
                          { type: "Product", id: productId },
                      ]
                    : [],
        }),
    }),
});

export const {
    useCreateBusinessProductMutation,
    useDeleteBusinessProductMutation,
    useGetBusinessProductsQuery,
    useGetProductQuery,
    useUpdateBusinessProductMutation,
} = catalogApi;
export { catalogApi };
export type {
    CreateBusinessProductRequest,
    DeleteBusinessProductRequest,
    ProductMutationPayload,
    UpdateBusinessProductRequest,
};

