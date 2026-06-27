import type { ProductDto } from "@internal/interfaces";
import { baseApi } from "@/lib/api/baseApi";

const catalogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBusinessProducts: builder.query<ProductDto[], number>({
            query: (businessId) => `/api/business/${businessId}/products`,
        }),
    }),
});

export const { useGetBusinessProductsQuery } = catalogApi;
export { catalogApi };
