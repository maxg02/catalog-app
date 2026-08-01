import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/lib/api/baseApi";
import { profileApi } from "@/features/profile/api/profileApi";
import { catalogApi, type ProductMutationPayload } from "@/features/catalog/api/catalogApi";
import { insightsApi } from "@/features/insights/api/insightsApi";

const product: ProductMutationPayload = {
    name: "P",
    price: 2,
    description: "D",
    details: {},
    isPublic: true,
    onStock: true,
    isFeatured: false,
    images: [],
    mainImageIndex: null,
};

const store = configureStore({
    reducer: { [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

const requests: { url: string; method: string }[] = [];
const fetchMock = jest.fn(async (input: RequestInfo | URL) => {
    const request = input as Request;
    const url = request.url;
    const method = request.method;
    requests.push({ url, method });
    const body = url.includes("geocoded.me/v2/countries")
        ? { data: [{ id: "DO", name: "Dominican Republic", flagUrl: "flag" }], meta: {} }
        : url.includes("geocoded.me/v2/states")
          ? { data: [{ name: "Distrito Nacional", countryCode: "DO", stateCode: "01" }], meta: {} }
          : method === "DELETE"
            ? undefined
            : { id: 1, businesses: [], overview: {}, productHighlights: [] };
    return new Response(body === undefined ? null : JSON.stringify(body), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});

beforeAll(() => {
    global.fetch = fetchMock as typeof fetch;
    jest.spyOn(console, "log").mockImplementation(() => undefined);
});

beforeEach(() => {
    requests.length = 0;
    fetchMock.mockClear();
    store.dispatch(baseApi.util.resetApiState());
});

afterAll(() => {
    store.dispatch(baseApi.util.resetApiState());
    jest.restoreAllMocks();
});

async function run(action: unknown) {
    const result = store.dispatch(action as never) as unknown as { unsubscribe?: () => void } & Promise<unknown>;
    await result;
    result.unsubscribe?.();
}

describe("RTK Query contracts", () => {
    it("uses every profile URL/method and transforms location responses", async () => {
        const countries = store.dispatch(profileApi.endpoints.getCountries.initiate());
        await countries;
        expect(profileApi.endpoints.getCountries.select()(store.getState()).data).toEqual([
            { id: "DO", name: "Dominican Republic", flagUrl: "flag" },
        ]);
        countries.unsubscribe();
        const states = store.dispatch(profileApi.endpoints.getStates.initiate("D O"));
        await states;
        expect(profileApi.endpoints.getStates.select("D O")(store.getState()).data).toEqual([
            { name: "Distrito Nacional", countryCode: "DO", stateCode: "01" },
        ]);
        states.unsubscribe();

        await run(profileApi.endpoints.getProfile.initiate());
        await run(profileApi.endpoints.getBusiness.initiate(7));
        await run(profileApi.endpoints.updateUser.initiate({ name: "A", email: "a@b.co" }));
        await run(profileApi.endpoints.createBusiness.initiate({
            name: "B", bannerImage: null, description: null, category: null, location: null,
        }));
        await run(profileApi.endpoints.updateBusiness.initiate({
            businessId: 7,
            business: { name: "B", bannerImage: null, description: null, category: null, location: null },
        }));
        await run(profileApi.endpoints.deleteBusiness.initiate(7));

        expect(requests).toEqual(expect.arrayContaining([
            { url: "http://localhost:3000/api/users/1/profile", method: "GET" },
            { url: "http://localhost:3000/api/business/7", method: "GET" },
            { url: "http://localhost:3000/api/users/1", method: "PUT" },
            { url: "http://localhost:3000/api/users/1/businesses", method: "POST" },
            { url: "http://localhost:3000/api/business/7", method: "PUT" },
            { url: "http://localhost:3000/api/business/7", method: "DELETE" },
            { url: "https://api.geocoded.me/v2/countries?fields=id,name,flagUrl&limit=2000", method: "GET" },
            { url: "https://api.geocoded.me/v2/states?fields=name,countryCode,stateCode&filter[country]=D%20O&limit=2000", method: "GET" },
        ]));
    });

    it("uses every catalog and insight URL/method", async () => {
        await run(catalogApi.endpoints.getBusinessProducts.initiate(3));
        await run(catalogApi.endpoints.getProduct.initiate(9));
        await run(catalogApi.endpoints.createBusinessProduct.initiate({ businessId: 3, product }));
        await run(catalogApi.endpoints.updateBusinessProduct.initiate({ businessId: 3, productId: 9, product }));
        await run(catalogApi.endpoints.deleteBusinessProduct.initiate({ businessId: 3, productId: 9 }));
        await run(insightsApi.endpoints.getBusinessInsights.initiate(3));

        expect(requests).toEqual(expect.arrayContaining([
            { url: "http://localhost:3000/api/business/3/products", method: "GET" },
            { url: "http://localhost:3000/api/products/9", method: "GET" },
            { url: "http://localhost:3000/api/business/3/products", method: "POST" },
            { url: "http://localhost:3000/api/products/9", method: "PUT" },
            { url: "http://localhost:3000/api/products/9", method: "DELETE" },
            { url: "http://localhost:3000/api/business/3/insights", method: "GET" },
        ]));
    });
    it("refetches invalidated catalog data only after a successful delete", async () => {
        const subscription = store.dispatch(catalogApi.endpoints.getBusinessProducts.initiate(22));
        await subscription;
        requests.length = 0;
        await run(catalogApi.endpoints.deleteBusinessProduct.initiate({ businessId: 22, productId: 5 }));
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(requests).toEqual(expect.arrayContaining([
            { url: "http://localhost:3000/api/products/5", method: "DELETE" },
            { url: "http://localhost:3000/api/business/22/products", method: "GET" },
        ]));
        subscription.unsubscribe();

        store.dispatch(baseApi.util.resetApiState());
        const failedSubscription = store.dispatch(catalogApi.endpoints.getBusinessProducts.initiate(22));
        await failedSubscription;
        requests.length = 0;
        fetchMock.mockImplementationOnce(async (input: RequestInfo | URL) => {
            const request = input as Request;
            requests.push({ url: request.url, method: request.method });
            return new Response(JSON.stringify({ error: "failed" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        });
        await run(catalogApi.endpoints.deleteBusinessProduct.initiate({ businessId: 22, productId: 5 }));
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(requests).toEqual([{ url: "http://localhost:3000/api/products/5", method: "DELETE" }]);
        failedSubscription.unsubscribe();
    });
});
