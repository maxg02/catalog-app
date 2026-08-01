import Constants from "expo-constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const getWebApiUrl = (expoConfig: { hostUri?: string } | null = Constants.expoConfig) => {
    if (process.env.EXPO_PUBLIC_WEB_API_URL) {
        return process.env.EXPO_PUBLIC_WEB_API_URL;
    }

    const expoHost = expoConfig?.hostUri?.split(":")[0];

    return expoHost ? `http://${expoHost}:3000` : undefined;
};

const baseQuery = fetchBaseQuery({
    baseUrl: getWebApiUrl(),
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
    tagTypes: ["Profile", "Business", "BusinessProducts", "Product"],
    endpoints: () => ({}),
});
