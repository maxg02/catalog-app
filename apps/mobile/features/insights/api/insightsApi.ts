import type { BusinessInsightsDto } from "@internal/interfaces";
import { baseApi } from "@/lib/api/baseApi";

const insightsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBusinessInsights: builder.query<BusinessInsightsDto, number>({
            query: (businessId) => `/api/business/${businessId}/insights`,
        }),
    }),
});

export const { useGetBusinessInsightsQuery } = insightsApi;
export { insightsApi };
