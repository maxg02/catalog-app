import { ProductDto } from "interfaces";
import React from "react";
import { View, Text, ImageBackground } from "react-native";

function ProductCard(productData: ProductDto) {
    return (
        <View>
            <ImageBackground
                source={{ uri: productData.image }}
                className="w-full h-40 rounded-lg overflow-hidden justify-end p-2"
            >
                <Text>{productData.name}</Text>
            </ImageBackground>
        </View>
    );
}

export default ProductCard;
