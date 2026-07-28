import type { BusinessLocationDto, BusinessProfileDto, ProfileDto, UserDto } from "@internal/interfaces";
import { BusinessCategories } from "@internal/enums";
import type { ProductImageAsset } from "@/features/catalog/components/productMediaUpload";
import { baseApi } from "@/lib/api/baseApi";

const DEMO_USER_ID = 1;

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

type UpdateUserPayload = {
    name: string;
    email: string;
    password?: string;
};

type BusinessMutationPayload = {
    name: string;
    bannerImage: ProductImageAsset | null;
    description: string | null;
    category: BusinessCategories | null;
    location: BusinessLocationDto | null;
};

type UpdateBusinessRequest = {
    businessId: number;
    business: BusinessMutationPayload;
};

function getBusinessFormData(business: BusinessMutationPayload) {
    const formData = new FormData();
    formData.append("name", business.name);
    formData.append("description", business.description ?? "");
    formData.append("category", business.category == null ? "" : String(business.category));
    formData.append("location", JSON.stringify(business.location));
    formData.append("bannerAction", business.bannerImage ? (business.bannerImage.isExisting ? "keep" : "replace") : "remove");

    if (business.bannerImage && !business.bannerImage.isExisting) {
        formData.append("bannerImage", {
            uri: business.bannerImage.uri,
            name: business.bannerImage.name,
            type: business.bannerImage.type,
        } as unknown as Blob);
    }

    return formData;
}
const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<ProfileDto, void>({
            query: () => `/api/users/${DEMO_USER_ID}/profile`,
            providesTags: ["Profile"],
        }),
        getBusiness: builder.query<BusinessProfileDto, number>({
            query: (businessId) => `/api/business/${businessId}`,
            providesTags: (_result, _error, businessId) => [{ type: "Business", id: businessId }],
        }),
        updateUser: builder.mutation<UserDto, UpdateUserPayload>({
            query: (user) => ({
                url: `/api/users/${DEMO_USER_ID}`,
                method: "PUT",
                body: user,
            }),
            invalidatesTags: ["Profile"],
        }),
        createBusiness: builder.mutation<BusinessProfileDto, BusinessMutationPayload>({
            query: (business) => ({
                url: `/api/users/${DEMO_USER_ID}/businesses`,
                method: "POST",
                body: getBusinessFormData(business),
            }),
            invalidatesTags: ["Profile"],
        }),
        updateBusiness: builder.mutation<BusinessProfileDto, UpdateBusinessRequest>({
            query: ({ businessId, business }) => ({
                url: `/api/business/${businessId}`,
                method: "PUT",
                body: getBusinessFormData(business),
            }),
            invalidatesTags: (result, _error, { businessId }) =>
                result ? ["Profile", { type: "Business", id: businessId }] : [],
        }),
        deleteBusiness: builder.mutation<void, number>({
            query: (businessId) => ({
                url: `/api/business/${businessId}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, error, businessId) =>
                !error ? ["Profile", { type: "Business", id: businessId }] : [],
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

export const {
    useCreateBusinessMutation,
    useDeleteBusinessMutation,
    useGetBusinessQuery,
    useGetCountriesQuery,
    useGetProfileQuery,
    useGetStatesQuery,
    useUpdateBusinessMutation,
    useUpdateUserMutation,
} = profileApi;
export const useGetProfileQueryState = profileApi.endpoints.getProfile.useQueryState;
export { DEMO_USER_ID, profileApi };
export type {
    BusinessMutationPayload,
    CountryDto,
    CountriesResponseDto,
    StateDto,
    StatesResponseDto,
    UpdateBusinessRequest,
    UpdateUserPayload,
};


