import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Image, View } from "react-native";
import { useRouter } from "expo-router";
import {
    Building2Icon,
    LockIcon,
    MailIcon,
    MoreVerticalIcon,
    PencilIcon,
    PlusIcon,
    SaveIcon,
    Trash2Icon,
    UserIcon,
} from "lucide-nativewind";
import {
    getPasswordRequirementErrors,
    type BusinessProfileDto,
    type ProfileDto,
} from "@internal/interfaces";
import AlertDialog from "@/components/ui/alertDialog";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import DropdownMenu, { type DropdownMenuAction } from "@/components/ui/dropdownMenu";
import { IconInput } from "@/components/ui/iconInput";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import { Text } from "@/components/ui/text";
import { useDeleteBusinessMutation, useUpdateUserMutation } from "@/features/profile/api/profileApi";
import { formatBusinessCategory } from "@/features/profile/lib/formatBusinessCategory";
import { getAccountValues, getSubmitErrorData, type AccountFormValues } from "@/features/profile/lib/formLogic";
import { cn } from "@/lib/utils";

type ManageAccountBusinessesFormProps = {
    profile: ProfileDto;
};

type SubmitErrorData = {
    error?: string;
    fieldErrors?: Partial<Record<"name" | "email" | "password", string>>;
};

type BusinessCardProps = {
    business: BusinessProfileDto;
    isDeleting?: boolean;
    onDelete: (businessId: number) => Promise<void>;
};

function FieldError({ message }: { message?: string }) {
    return message ? <Text className="text-xs text-destructive">{message}</Text> : null;
}

function BusinessCard({ business, isDeleting = false, onDelete }: BusinessCardProps) {
    const router = useRouter();
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
    const [isDeleteErrorVisible, setIsDeleteErrorVisible] = useState(false);

    const editBusiness = () => {
        router.push({ pathname: "/profile/business/[id]", params: { id: business.id } });
    };

    const deleteBusiness = async () => {
        setIsDeleteAlertVisible(false);

        try {
            await onDelete(business.id);
        } catch {
            setIsDeleteErrorVisible(true);
        }
    };


    const actions: DropdownMenuAction[] = [
        { key: "edit", label: "Edit", icon: PencilIcon, onPress: editBusiness },
        {
            key: "delete",
            label: "Delete",
            icon: Trash2Icon,
            destructive: true,
            disabled: isDeleting,
            onPress: () => setIsDeleteAlertVisible(true),
        },
    ];

    return (
        <>
            <Card className="p-3">
                <View className="flex-row gap-3">
                    <View className="h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                        {business.bannerImage ? (
                            <Image
                                source={{ uri: business.bannerImage }}
                                className="h-24 w-24"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center opacity-30">
                                <Building2Icon className="text-white" size={30} />
                            </View>
                        )}
                    </View>
                    <View className="flex-1 justify-center gap-2">
                        <Text variant="h3" numberOfLines={2} className="font-jakarta-bold">
                            {business.name}
                        </Text>
                        <Text className="text-xs font-jakarta-extrabold uppercase text-primary">
                            {formatBusinessCategory(business.category)}
                        </Text>
                        <Text variant="muted" numberOfLines={2} className="text-xs">
                            {business.description || "No description added."}
                        </Text>
                    </View>
                    <View className="items-end justify-center">
                        <DropdownMenu
                            actions={actions}
                            disabled={isDeleting}
                            trigger={<MoreVerticalIcon className="text-primary" size={20} />}
                            triggerAccessibilityLabel={`Open actions for ${business.name}`}
                        />
                    </View>
                </View>
            </Card>
            <AlertDialog
                visible={isDeleteAlertVisible}
                title="Delete business?"
                description={`Delete ${business.name}? This cannot be undone.`}
                icon={Trash2Icon}
                iconClassName="text-destructive"
                iconContainerClassName="bg-destructive/10"
                onClose={() => setIsDeleteAlertVisible(false)}
                secondaryAction={{ label: "Cancel", onPress: () => setIsDeleteAlertVisible(false) }}
                primaryAction={{
                    label: "Delete",
                    variant: "destructive",
                    disabled: isDeleting,
                    onPress: () => void deleteBusiness(),
                }}
            />
            <AlertDialog
                visible={isDeleteErrorVisible}
                title="Unable to delete business"
                description="Please try again."
                icon={Trash2Icon}
                iconClassName="text-destructive"
                iconContainerClassName="bg-destructive/10"
                onClose={() => setIsDeleteErrorVisible(false)}
                primaryAction={{ label: "OK", onPress: () => setIsDeleteErrorVisible(false) }}
            />
        </>
    );
}

function ManageAccountBusinessesForm({ profile }: ManageAccountBusinessesFormProps) {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
    const [deleteBusiness, { isLoading: isDeletingBusiness }] = useDeleteBusinessMutation();
    const defaultValues = getAccountValues(profile);
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AccountFormValues>({ defaultValues });
    const isSaving = isSubmitting || isUpdatingUser;
    const password = useWatch({ control, name: "password" });
    const passwordErrors = password ? getPasswordRequirementErrors(password.trim()) : [];

    useEffect(() => {
        reset(getAccountValues(profile));
    }, [profile, reset]);

    const submit = async (values: AccountFormValues) => {
        setSubmitError(null);

        try {
            await updateUser({
                name: values.name.trim(),
                email: values.email.trim(),
                password: values.password.trim() || undefined,
            }).unwrap();
            reset({
                name: values.name.trim(),
                email: values.email.trim(),
                password: "",
                confirmPassword: "",
            });
        } catch (error) {
            const data = getSubmitErrorData<SubmitErrorData>(error);

            Object.entries(data?.fieldErrors ?? {}).forEach(([field, message]) => {
                if ((field === "name" || field === "email" || field === "password") && message) {
                    setError(field, { message });
                }
            });

            setSubmitError(data?.error ?? "Unable to update account.");
        }
    };

    const deleteManagedBusiness = (businessId: number) => deleteBusiness(businessId).unwrap();

    return (
        <>
            <View className="gap-4">
                <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                    Account
                </Text>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Name</Text>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ validate: (value) => value.trim().length > 0 || "Name is required." }}
                        render={({ field: { onBlur, onChange, value } }) => (
                            <IconInput
                                icon={UserIcon}
                                editable={!isSaving}
                                placeholder="Your name"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                className={cn(errors.name && "border-destructive")}
                            />
                        )}
                    />
                    <FieldError message={errors.name?.message} />
                </View>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Email</Text>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            validate: (value) =>
                                (value.trim().length > 0 && value.includes("@")) ||
                                "Valid email is required.",
                        }}
                        render={({ field: { onBlur, onChange, value } }) => (
                            <IconInput
                                icon={MailIcon}
                                editable={!isSaving}
                                placeholder="you@email.com"
                                keyboardType="email-address"
                                inputMode="email"
                                autoCapitalize="none"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                className={cn(errors.email && "border-destructive")}
                            />
                        )}
                    />
                    <FieldError message={errors.email?.message} />
                </View>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Password</Text>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            validate: (value) =>
                                !value ||
                                getPasswordRequirementErrors(value.trim()).length === 0 ||
                                "Password does not meet the requirements.",
                        }}
                        render={({ field: { onBlur, onChange, value } }) => (
                            <IconInput
                                icon={LockIcon}
                                editable={!isSaving}
                                placeholder="New password"
                                secureTextEntry
                                textContentType="newPassword"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                className={cn(errors.password && "border-destructive")}
                            />
                        )}
                    />
                    <FieldError message={errors.password?.message} />
                    {passwordErrors.length > 0 && (
                        <Text
                            className="text-xs text-destructive"
                            accessibilityLiveRegion="polite"
                        >
                            {passwordErrors.map((message) => `• ${message}`).join("\n")}
                        </Text>
                    )}
                </View>
                <View className="gap-2">
                    <Text className="font-jakarta-bold">Confirm password</Text>
                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={{
                            deps: ["password"],
                            validate: (value) =>
                                (!password && !value) ||
                                value === password ||
                                "Passwords do not match.",
                        }}
                        render={({ field: { onBlur, onChange, value } }) => (
                            <IconInput
                                icon={LockIcon}
                                editable={!isSaving}
                                placeholder="Confirm new password"
                                secureTextEntry
                                textContentType="newPassword"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                className={cn(errors.confirmPassword && "border-destructive")}
                            />
                        )}
                    />
                    <FieldError message={errors.confirmPassword?.message} />
                </View>
                {submitError && <Text className="text-sm text-destructive">{submitError}</Text>}
                <Button
                    className="h-14 rounded-full"
                    disabled={isSaving}
                    onPress={() => void handleSubmit(submit)()}
                >
                    <SaveIcon size={20} className="text-primary-foreground" />
                    <Text className="font-jakarta-bold">
                        {isSaving ? "Updating account..." : "Update Account"}
                    </Text>
                </Button>
            </View>

            <View className="gap-4">
                <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                    Businesses
                </Text>
                {profile.businesses.length > 0 ? (
                    <View className="gap-3">
                        {profile.businesses.map((business) => (
                            <BusinessCard
                                key={business.id}
                                business={business}
                                isDeleting={isDeletingBusiness}
                                onDelete={deleteManagedBusiness}
                            />
                        ))}
                    </View>
                ) : (
                    <Text variant="muted">No businesses added yet.</Text>
                )}
                <Button
                    variant="secondary"
                    className="h-14 rounded-full"
                    onPress={() => router.push("/profile/business/add")}
                >
                    <PlusIcon size={20} className="text-secondary-foreground" />
                    <Text className="font-jakarta-bold">Add Business</Text>
                </Button>
            </View>

            {(isUpdatingUser || isDeletingBusiness) && (
                <LoadingOverlay
                    label={isDeletingBusiness ? "Deleting business..." : "Updating account..."}
                />
            )}
        </>
    );
}

export default ManageAccountBusinessesForm;
export type { ManageAccountBusinessesFormProps };
