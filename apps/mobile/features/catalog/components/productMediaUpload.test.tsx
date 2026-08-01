import React from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import ProductMediaUpload from "./productMediaUpload";
import type { ProductImageAsset } from "@/features/catalog/lib/productLogic";

jest.mock("lucide-nativewind", () => ({ CameraIcon: () => null, ImagesIcon: () => null }));

jest.mock("./productImagesModal", () => {
    const ReactNative = jest.requireActual("react-native");
    return ({ visible, onDeleteImage, onSelectMainImage, onChooseImages }: {
        visible: boolean;
        onDeleteImage: (index: number) => void;
        onSelectMainImage: (index: number) => void;
        onChooseImages: () => void;
    }) => visible ? (
        <ReactNative.View>
            <ReactNative.Pressable onPress={() => onDeleteImage(0)}><ReactNative.Text>Delete first</ReactNative.Text></ReactNative.Pressable>
            <ReactNative.Pressable onPress={() => onSelectMainImage(1)}><ReactNative.Text>Select second</ReactNative.Text></ReactNative.Pressable>
            <ReactNative.Pressable onPress={onChooseImages}><ReactNative.Text>Add more</ReactNative.Text></ReactNative.Pressable>
        </ReactNative.View>
    ) : null;
});

const asset = (uri: string): ProductImageAsset => ({ uri, name: `${uri}.jpg`, type: "image/jpeg" });
const picker = ImagePicker as jest.Mocked<typeof ImagePicker>;

describe("product media upload", () => {
    beforeEach(() => jest.clearAllMocks());

    it("reports denied camera permission and ignores picker cancellation", async () => {
        picker.requestCameraPermissionsAsync.mockResolvedValue({ granted: false } as never);
        picker.launchImageLibraryAsync.mockResolvedValue({ canceled: true } as never);
        const alert = jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
        const onImagesChange = jest.fn();
        await render(
            <ProductMediaUpload images={[]} mainImageIndex={null} onImagesChange={onImagesChange} onMainImageIndexChange={jest.fn()} />,
        );
        await fireEvent.press(screen.getByText("Take Photo"));
        await screen.findByText("Take Photo");
        expect(alert).toHaveBeenCalledWith("Camera access needed", expect.any(String));
        await fireEvent.press(screen.getByText("Choose Photos"));
        await screen.findByText("Choose Photos");
        expect(onImagesChange).not.toHaveBeenCalled();
    });

    it("selects images, defaults main, removes, rebases, and enforces the maximum", async () => {
        picker.launchImageLibraryAsync.mockResolvedValue({
            canceled: false,
            assets: [{ uri: "picked", fileName: null, mimeType: null }],
        } as never);
        const onImagesChange = jest.fn();
        const onMainImageIndexChange = jest.fn();
        const view = await render(
            <ProductMediaUpload images={[]} mainImageIndex={null} onImagesChange={onImagesChange} onMainImageIndexChange={onMainImageIndexChange} />,
        );
        await fireEvent.press(screen.getByText("Choose Photos"));
        await screen.findByText("Choose Photos");
        expect(onImagesChange).toHaveBeenCalledWith([{ uri: "picked", name: "picked", type: "image/jpeg" }]);
        expect(onMainImageIndexChange).toHaveBeenCalledWith(0);

        const images = [asset("1"), asset("2"), asset("3"), asset("4")];
        await view.rerender(
            <ProductMediaUpload images={images} mainImageIndex={2} onImagesChange={onImagesChange} onMainImageIndexChange={onMainImageIndexChange} />,
        );
        await fireEvent.press(screen.getByText("Manage Photos"));
        await fireEvent.press(screen.getByText("Delete first"));
        expect(onImagesChange).toHaveBeenLastCalledWith(images.slice(1));
        expect(onMainImageIndexChange).toHaveBeenLastCalledWith(1);
        await fireEvent.press(screen.getByText("Add more"));
        expect(picker.launchImageLibraryAsync).toHaveBeenCalledTimes(1);
    });
});
