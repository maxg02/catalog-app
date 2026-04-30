import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import { cn, testUser } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function Catalog() {
    const [activeTab, setActiveTab] = useState<"all" | "public" | "draft">("all");

    const scrollAmount = useScrollAmount("catalog");
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) {
                scrollAmount.value = event.contentOffset.y;
            }
        },
    });

    useEffect(() => {
        if (scrollAmount) {
            scrollAmount.value = 0;
        }

        return () => {
            if (scrollAmount) {
                scrollAmount.value = 0;
            }
        };
    }, [scrollAmount]);

    if (testUser.rol === "customer") {
        return <Redirect href="/" />;
    }

    return (
        <Animated.ScrollView
            onScroll={handleScroll}
            scrollEventThrottle={16}
            className="bg-background flex-1"
        >
            <Tabs.Screen options={{ title: "Catalog Management" }} />
            <View className="flex-row px-4 gap-3 border-b border-border">
                <Button
                    className={cn(
                        "rounded-none px-0 h-14 w-24",
                        activeTab === "all" && "border-b-4 border-primary",
                    )}
                    variant={"ghost"}
                    onPress={() => setActiveTab("all")}
                >
                    <Text
                        className={cn(
                            "font-jakarta-bold text-muted-foreground",
                            activeTab === "all" && "text-primary",
                        )}
                    >
                        All Items
                    </Text>
                </Button>
                <Button
                    className={cn(
                        "rounded-none px-0 h-14 w-24",
                        activeTab === "public" && "border-b-4 border-primary",
                    )}
                    variant={"ghost"}
                    onPress={() => setActiveTab("public")}
                >
                    <Text
                        className={cn(
                            "font-jakarta-bold text-muted-foreground",
                            activeTab === "public" && "text-primary",
                        )}
                    >
                        Public
                    </Text>
                </Button>
                <Button
                    className={cn(
                        "rounded-none px-0 h-14 w-24",
                        activeTab === "draft" && "border-b-4 border-primary",
                    )}
                    variant={"ghost"}
                    onPress={() => setActiveTab("draft")}
                >
                    <Text
                        className={cn(
                            "font-jakarta-bold text-muted-foreground",
                            activeTab === "draft" && "text-primary",
                        )}
                    >
                        Draft
                    </Text>
                </Button>
            </View>
        </Animated.ScrollView>
    );
}

export default Catalog;
