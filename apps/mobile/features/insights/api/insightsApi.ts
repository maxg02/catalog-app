import type { BusinessInsightsDto } from "@internal/interfaces";
import { baseApi } from "@/lib/api/baseApi";

const insightsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBusinessInsights: builder.query<BusinessInsightsDto, void>({
            query: () => "/api/businessUser/insights",
        }),
    }),
});

export const { useGetBusinessInsightsQuery } = insightsApi;
export { insightsApi };
