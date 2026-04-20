import HeaderContainer from "@/components/layout/headerContainer";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";

export default function _layout() {
    return (
        <SafeAreaView className="flex-1 bg-background">
            <Stack
                screenOptions={{
                    header: ({ options }) => (
                        <HeaderContainer>
                            <View>
                                <Text className="font-jakarta-bold">{options.title}</Text>
                            </View>
                        </HeaderContainer>
                    ),
                }}
            />
        </SafeAreaView>
    );
}
