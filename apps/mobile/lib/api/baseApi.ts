import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Platform } from "react-native";

type TestApiResponse = {
    ok: boolean;
    message: string;
};

const fallbackWebApiUrl = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

const webApiUrl = process.env.EXPO_PUBLIC_WEB_API_URL ?? fallbackWebApiUrl;

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: webApiUrl,
    }),
    endpoints: (builder) => ({
        getTest: builder.query<TestApiResponse, void>({
            query: () => "/api/test",
        }),
    }),
});

export const { useGetTestQuery } = baseApi;
export type { TestApiResponse };
