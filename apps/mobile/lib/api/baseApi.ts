import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const webApiUrl = process.env.EXPO_PUBLIC_WEB_API_URL;

const baseQuery = fetchBaseQuery({
    baseUrl: webApiUrl,
});

const baseQueryWithLogging: typeof baseQuery = async (args, api, extraOptions) => {
    console.log("RTK Request:", args);

    const result = await baseQuery(args, api, extraOptions);

    console.log("RTK Response:", result);

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithLogging,
    endpoints: () => ({}),
});
