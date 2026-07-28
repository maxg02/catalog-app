import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Building2Icon, MapPinIcon, SaveIcon } from "lucide-nativewind";
import { BusinessCategories } from "@internal/enums";
import type { BusinessLocationDto, BusinessProfileDto } from "@internal/interfaces";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/iconInput";
import LoadingOverlay from "@/components/ui/loadingOverlay";
import SearchableSelect from "@/components/ui/searchableSelect";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import BusinessCategorySelector from "@/features/profile/components/businessCategorySelector";
import BusinessBannerUpload from "@/features/profile/components/businessBannerUpload";
import type { ProductImageAsset } from "@/features/catalog/components/productMediaUpload";
import {
    type BusinessMutationPayload,
    type CountryDto,
    type StateDto,
    useGetCountriesQuery,
    useGetStatesQuery,
} from "@/features/profile/api/profileApi";
import { cn } from "@/lib/utils";

type BusinessFormValues = {
    name: string;
    category: BusinessCategories;
    description: string;
    address: string;
    city: string;
    country: string;
};

type BusinessFormProps = {
    defaultValues: BusinessFormValues
    defaultBannerImage?: ProductImageAsset | null;
    submitLabel: string;
    loadingLabel: string;
    isSaving?: boolean;
    onSubmit: (business: BusinessMutationPayload) => Promise<void>;
};

type SubmitErrorData = {
    error?: string;
    fieldErrors?: Partial<Record<"name" | "category" | "location", string>>;
};

const emptyBusinessValues: BusinessFormValues = {
    name: "",
    category: BusinessCategories.FOOD,
    description: "",
    address: "",
    city: "",
    country: "",
};

function getBusinessFormValues(business: BusinessProfileDto): BusinessFormValues {
    return {
        name: business.name,
        category: business.category ?? BusinessCategories.FOOD,
        description: business.description ?? "",
        address: business.location?.address ?? "",
        city: business.location?.city ?? "",
        country: business.location?.country ?? "",
    };
}

function nullableText(value: string) {
    const trimmed = value.trim();

    return trimmed ? trimmed : null;
}

function getLocation(values: BusinessFormValues): BusinessLocationDto | null {
    const address = values.address.trim();
    const city = values.city.trim();
    const country = values.country.trim();

    return address || city || country ? { address, city, country } : null;
}

function getSubmitErrorData(error: unknown) {
    if (typeof error !== "object" || !error || !("data" in error)) return undefined;

    const data = (error as { data?: unknown }).data;

    return typeof data === "object" && data ? (data as SubmitErrorData) : undefined;
}

function FieldError({ message }: { message?: string }) {
    return message ? <Text className="text-xs text-destructive">{message}</Text> : null;
}

function getCountryCode(countries: CountryDto[], value: string) {
    return countries.find((country) => country.id === value || country.name === value)?.id ?? "";
}

function getStateCode(states: StateDto[], value: string) {
    return states.find((state) => state.stateCode === value || state.name === value)?.stateCode ?? "";
}

function withCurrentOption(options: { label: string; value: string }[], current: string) {
    const value = current.trim();

    return value && !options.some((option) => option.value === value || option.label === value)
        ? [{ label: value, value }, ...options]
        : options;
}

function BusinessForm({
    defaultValues,
    defaultBannerImage = null,
    submitLabel,
    loadingLabel,
    isSaving: isExternallySaving = false,
    onSubmit,
}: BusinessFormProps) {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [bannerImage, setBannerImage] = useState<ProductImageAsset | null>(defaultBannerImage);
    const {
        control,
        handleSubmit,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<BusinessFormValues>({ defaultValues });
    const isSaving = isSubmitting || isExternallySaving;
    const countryValue = watch("country");
    const cityValue = watch("city");
    const {
        data: countries = [],
        isError: isCountriesError,
        isLoading: isCountriesLoading,
    } = useGetCountriesQuery();
    const selectedCountryCode = getCountryCode(countries, countryValue);
    const {
        data: states = [],
        isError: isStatesError,
        isLoading: isStatesLoading,
    } = useGetStatesQuery(selectedCountryCode, { skip: !selectedCountryCode });
    const countryOptions = useMemo(
        () =>
            withCurrentOption(
                countries.map((country) => ({ label: country.name, value: country.id })),
                countryValue,
            ),
        [countries, countryValue],
    );
    const stateOptions = useMemo(
        () =>
            withCurrentOption(
                states.map((state) => ({ label: state.name, value: state.stateCode })),
                cityValue,
            ),
        [cityValue, states],
    );
    const countryPlaceholder = isCountriesLoading ? "Loading countries..." : "Select country";
    const countryEmptyMessage = isCountriesError ? "Unable to load countries" : "No countries found";
    const statePlaceholder = !selectedCountryCode
        ? "Select a country first"
        : isStatesLoading
          ? "Loading states..."
          : "Select state";
    const stateEmptyMessage = isStatesError ? "Unable to load states" : "No states found";
    const isCountrySelectDisabled = isSaving || isCountriesLoading;
    const isStateSelectDisabled = isSaving || !selectedCountryCode || isStatesLoading;
    const scrollAmount = useScrollAmount();
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) scrollAmount.value = event.contentOffset.y;
        },
    });

    useEffect(() => {
        reset(defaultValues);
        setBannerImage(defaultBannerImage);
    }, [defaultBannerImage, defaultValues, reset]);

    useEffect(() => {
        if (scrollAmount) scrollAmount.value = 0;

        return () => {
            if (scrollAmount) scrollAmount.value = 0;
        };
    }, [scrollAmount]);

    const submit = async (values: BusinessFormValues) => {
        setSubmitError(null);

        try {
            await onSubmit({
                name: values.name.trim(),
                bannerImage,
                description: nullableText(values.description),
                category: values.category,
                location: getLocation(values),
            });
        } catch (error) {
            const data = getSubmitErrorData(error);

            if (data?.fieldErrors?.name) setError("name", { message: data.fieldErrors.name });
            if (data?.fieldErrors?.category) setError("category", { message: data.fieldErrors.category });

            setSubmitError(data?.fieldErrors?.location ?? data?.error ?? "Unable to save business.");
        }
    };

    return (
        <>
            <Animated.ScrollView
                className="flex-1 bg-background"
                contentContainerClassName="gap-7 px-6 pb-8"
                keyboardShouldPersistTaps="handled"
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View className="gap-4">
                    <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                        Business Information
                    </Text>
                    <BusinessBannerUpload image={bannerImage} onImageChange={setBannerImage} disabled={isSaving} />
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">Business Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            rules={{ validate: (value) => value.trim().length > 0 || "Business name is required." }}
                            render={({ field: { onBlur, onChange, value } }) => (
                                <IconInput
                                    icon={Building2Icon}
                                    editable={!isSaving}
                                    placeholder="Business name"
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
                        <Text className="font-jakarta-bold">Category</Text>
                        <Controller
                            control={control}
                            name="category"
                            render={({ field: { onChange, value } }) => (
                                <BusinessCategorySelector value={value} onValueChange={onChange} />
                            )}
                        />
                        <FieldError message={errors.category?.message} />
                    </View>
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">Description</Text>
                        <Controller
                            control={control}
                            name="description"
                            render={({ field: { onBlur, onChange, value } }) => (
                                <Textarea
                                    editable={!isSaving}
                                    placeholder="Tell customers what makes your business special..."
                                    className="min-h-32"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                    </View>
                </View>

                <View className="gap-4">
                    <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                        Location
                    </Text>
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">Country</Text>
                        <Controller
                            control={control}
                            name="country"
                            render={({ field: { onChange, value } }) => (
                                <SearchableSelect
                                    options={countryOptions}
                                    value={getCountryCode(countries, value) || value || null}
                                    onValueChange={(countryCode) => {
                                        const country = countries.find((item) => item.id === countryCode);

                                        onChange(country?.name ?? countryCode);
                                        setValue("city", "", { shouldDirty: true });
                                    }}
                                    disabled={isCountrySelectDisabled}
                                    emptyMessage={countryEmptyMessage}
                                    placeholder={countryPlaceholder}
                                    searchPlaceholder="Search countries..."
                                />
                            )}
                        />
                        {isCountriesError && (
                            <Text variant="muted" className="text-xs">
                                Check your connection and try again.
                            </Text>
                        )}
                    </View>
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">State</Text>
                        <Controller
                            control={control}
                            name="city"
                            render={({ field: { onChange, value } }) => (
                                <SearchableSelect
                                    options={stateOptions}
                                    value={getStateCode(states, value) || value || null}
                                    onValueChange={(stateCode) => {
                                        const state = states.find((item) => item.stateCode === stateCode);

                                        onChange(state?.name ?? stateCode);
                                    }}
                                    disabled={isStateSelectDisabled}
                                    emptyMessage={stateEmptyMessage}
                                    placeholder={statePlaceholder}
                                    searchPlaceholder="Search states..."
                                />
                            )}
                        />
                        {isStatesError && (
                            <Text variant="muted" className="text-xs">
                                Check your connection and try again.
                            </Text>
                        )}
                    </View>
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">Address</Text>
                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onBlur, onChange, value } }) => (
                                <IconInput
                                    icon={MapPinIcon}
                                    editable={!isSaving}
                                    placeholder="Street address"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                    </View>
                </View>

                {submitError && <Text className="text-sm text-destructive">{submitError}</Text>}

                <Button
                    className="h-14 rounded-full"
                    disabled={isSaving}
                    onPress={() => void handleSubmit(submit)()}
                >
                    <SaveIcon size={20} className="text-primary-foreground" />
                    <Text className="font-jakarta-bold">{isSaving ? loadingLabel : submitLabel}</Text>
                </Button>
            </Animated.ScrollView>
            {isSaving && <LoadingOverlay label={loadingLabel} />}
        </>
    );
}

export { emptyBusinessValues, getBusinessFormValues };
export default BusinessForm;
export type { BusinessFormProps, BusinessFormValues };










