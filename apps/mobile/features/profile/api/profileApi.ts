import type { UserBusinessDto } from "@internal/interfaces";
import { baseApi } from "@/lib/api/baseApi";

type CountryDto = {
    id: string;
    name: string;
    flagUrl: string;
};

type CountriesResponseDto = {
    data: CountryDto[];
    meta: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
        cursor?: string;
    };
};

type StateDto = {
    name: string;
    countryCode: string;
    stateCode: string;
};

type StatesResponseDto = {
    data: StateDto[];
    meta: {
        total: number;
        limit: number;
        offset: number;
        hasMore: boolean;
        cursor?: string;
    };
};

const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserInformation: builder.query<UserBusinessDto, void>({
            query: () => "/api/business/1",
        }),
        getCountries: builder.query<CountryDto[], void>({
            query: () =>
                "https://api.geocoded.me/v2/countries?fields=id,name,flagUrl&limit=2000",
            transformResponse: (response: CountriesResponseDto) => response.data,
        }),
        getStates: builder.query<StateDto[], string>({
            query: (countryCode) =>
                `https://api.geocoded.me/v2/states?fields=name,countryCode,stateCode&filter[country]=${encodeURIComponent(countryCode)}&limit=2000`,
            transformResponse: (response: StatesResponseDto) => response.data,
        }),
    }),
});

export const { useGetCountriesQuery, useGetStatesQuery, useGetUserInformationQuery } = profileApi;
export const useGetUserInformationQueryState =
    profileApi.endpoints.getUserInformation.useQueryState;
export { profileApi };
export type { CountryDto, CountriesResponseDto, StateDto, StatesResponseDto };
