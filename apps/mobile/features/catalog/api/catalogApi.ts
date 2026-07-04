import type { ProductDto } from "@internal/interfaces";
import type { ProductImageAsset } from "@/features/catalog/components/productMediaUpload";
import { baseApi } from "@/lib/api/baseApi";

type CreateBusinessProductRequest = {
    businessId: number;
    product: {
        name: string;
        price: number;
        description: string;
        details: Record<string, string>;
        isPublic: boolean;
        onStock: boolean;
        isFeatured: boolean;
        images: ProductImageAsset[];
        mainImageIndex: number | null;
    };
};

function getCreateProductFormData(product: CreateBusinessProductRequest["product"]) {
    const formData = new FormData();

    formData.append("name", product.name);
    formData.append("price", String(product.price));
    formData.append("description", product.description);
    formData.append("details", JSON.stringify(product.details));
    formData.append("isPublic", String(product.isPublic));
    formData.append("onStock", String(product.onStock));
    formData.append("isFeatured", String(product.isFeatured));
    formData.append("mainImageIndex", String(product.mainImageIndex ?? 0));

    product.images.forEach((image) => {
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
        getBusinessProducts: builder.query<ProductDto[], number>({
            query: (businessId) => `/api/business/${businessId}/products`,
        }),
        createBusinessProduct: builder.mutation<ProductDto, CreateBusinessProductRequest>({
            query: ({ businessId, product }) => ({
                url: `/api/business/${businessId}/products`,
                method: "POST",
                body: getCreateProductFormData(product),
            }),
            async onQueryStarted({ businessId }, { dispatch, queryFulfilled }) {
                try {
                    const { data: product } = await queryFulfilled;

                    dispatch(
                        catalogApi.util.updateQueryData("getBusinessProducts", businessId, (draft) => {
                            draft.unshift(product);
                        }),
                    );
                } catch {
                    // Failed creates leave the catalog cache unchanged.
                }
            },
        }),
    }),
});

export const { useCreateBusinessProductMutation, useGetBusinessProductsQuery } = catalogApi;
export { catalogApi };
export type { CreateBusinessProductRequest };
