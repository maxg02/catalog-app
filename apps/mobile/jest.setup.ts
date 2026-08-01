import { setUpTests } from "react-native-reanimated";

setUpTests();

process.env.EXPO_PUBLIC_WEB_API_URL = "http://localhost:3000";

jest.mock("expo-router", () => {
    const Screen = () => null;
    return {
        Stack: Object.assign(() => null, { Screen }),
        Tabs: { Screen },
        useLocalSearchParams: jest.fn(() => ({})),
        useRouter: jest.fn(() => ({ back: jest.fn(), push: jest.fn(), replace: jest.fn() })),
    };
});

jest.mock("@maplibre/maplibre-react-native", () => ({}));
jest.mock("@shopify/react-native-skia", () => ({}));
jest.mock("victory-native", () => ({}));

jest.mock("expo-image-picker", () => ({
    launchCameraAsync: jest.fn(),
    launchImageLibraryAsync: jest.fn(),
    requestCameraPermissionsAsync: jest.fn(),
}));

jest.mock("@react-native-community/datetimepicker", () => ({
    DateTimePickerAndroid: { open: jest.fn() },
}));
