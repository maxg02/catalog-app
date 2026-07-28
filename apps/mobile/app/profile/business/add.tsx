import React from "react";
import { Stack, useRouter } from "expo-router";
import BusinessForm, { emptyBusinessValues } from "@/features/profile/components/businessForm";
import { useCreateBusinessMutation } from "@/features/profile/api/profileApi";
import type { BusinessMutationPayload } from "@/features/profile/api/profileApi";

function AddBusiness() {
    const router = useRouter();
    const [createBusiness, { isLoading }] = useCreateBusinessMutation();

    const onSubmit = async (business: BusinessMutationPayload) => {
        await createBusiness(business).unwrap();
        router.back();
    };

    return (
        <>
            <Stack.Screen options={{ title: "Add Business" }} />
            <BusinessForm
                defaultValues={emptyBusinessValues}
                submitLabel="Save Business"
                loadingLabel="Saving business..."
                isSaving={isLoading}
                onSubmit={onSubmit}
            />
        </>
    );
}

export default AddBusiness;
