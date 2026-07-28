import React, { useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Text } from "@/components/ui/text";
import BusinessForm, { getBusinessFormValues } from "@/features/profile/components/businessForm";
import {
    useGetBusinessQuery,
    useUpdateBusinessMutation,
    type BusinessMutationPayload,
} from "@/features/profile/api/profileApi";

function EditBusiness() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const businessId = Number(id);
    const isValidBusinessId = Number.isInteger(businessId) && businessId > 0;
    const {
        data: business,
        isLoading,
        isError,
        refetch,
    } = useGetBusinessQuery(businessId, { skip: !isValidBusinessId });
    const [updateBusiness, { isLoading: isUpdating }] = useUpdateBusinessMutation();
    const defaultValues = useMemo(() => (business ? getBusinessFormValues(business) : null), [business]);

    if (!isValidBusinessId) {
        return (
            <View className="flex-1 items-center justify-center gap-2 bg-background px-6">
                <Stack.Screen options={{ title: "Edit Business" }} />
                <Text variant="h1" className="text-center">
                    Business not found
                </Text>
                <Text variant="muted" className="text-center">
                    This business may have been removed.
                </Text>
            </View>
        );
    }

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center gap-4 bg-background px-6">
                <Stack.Screen options={{ title: "Edit Business" }} />
                <ActivityIndicator size="large" />
                <Text variant="muted">Loading business...</Text>
            </View>
        );
    }

    if (isError || !business || !defaultValues) {
        return (
            <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
                <Stack.Screen options={{ title: "Edit Business" }} />
                <Text variant="h1" className="text-center">
                    Business not found
                </Text>
                <Text variant="muted" className="text-center" onPress={() => refetch()}>
                    Tap to retry.
                </Text>
            </View>
        );
    }

    const onSubmit = async (nextBusiness: BusinessMutationPayload) => {
        await updateBusiness({ businessId, business: nextBusiness }).unwrap();
        router.back();
    };

    return (
        <>
            <Stack.Screen options={{ title: "Edit Business" }} />
            <BusinessForm
                defaultValues={defaultValues}
                defaultBannerImage={business.bannerImage ? { uri: business.bannerImage, name: "business-banner.jpg", type: "image/jpeg", isExisting: true } : null}
                submitLabel="Update Business"
                loadingLabel="Updating business..."
                isSaving={isUpdating}
                onSubmit={onSubmit}
            />
        </>
    );
}

export default EditBusiness;




