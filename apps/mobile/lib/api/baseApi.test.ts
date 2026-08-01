import { getWebApiUrl } from "./baseApi";

describe("API base URL", () => {
    const originalUrl = process.env.EXPO_PUBLIC_WEB_API_URL;

    afterEach(() => {
        process.env.EXPO_PUBLIC_WEB_API_URL = originalUrl;
    });

    it("prefers the public environment URL", () => {
        process.env.EXPO_PUBLIC_WEB_API_URL = "https://api.example.com";
        expect(getWebApiUrl({ hostUri: "10.0.0.2:8081" })).toBe("https://api.example.com");
    });

    it("falls back to the Expo host and then undefined", () => {
        delete process.env.EXPO_PUBLIC_WEB_API_URL;
        expect(getWebApiUrl({ hostUri: "10.0.0.2:8081" })).toBe("http://10.0.0.2:3000");
        expect(getWebApiUrl(null)).toBeUndefined();
    });
});