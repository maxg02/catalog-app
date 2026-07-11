import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
    CoinsIcon,
    EyeIcon,
    PackageIcon,
    PlusIcon,
    SaveIcon,
    StarIcon,
    TagIcon,
    Trash2Icon,
} from "lucide-nativewind";
import { ActivityIndicator, Pressable, Switch, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/card";
import CheckControl from "@/components/ui/checkControl";
import DateTimeInput from "@/components/ui/dateTimeInput";
import IconCircle from "@/components/ui/iconCircle";
import { IconInput } from "@/components/ui/iconInput";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useScrollAmount } from "@/contexts/scrollAmountContext";
import ProductMediaUpload, {
    type ProductImageAsset,
} from "@/features/catalog/components/productMediaUpload";
import { cn } from "@/lib/utils";

type ProductVisibility = "public" | "draft";

type ProductDetail = {
    title: string;
    description: string;
};

type ProductFormValues = {
    name: string;
    price: string;
    description: string;
    details: ProductDetail[];
    onStock: boolean;
    isFeatured: boolean;
    visibility: ProductVisibility;
    sale: boolean;
    salePrice: string;
    saleEndDate: Date | null;
};

type ProductFormSubmitValues = {
    name: string;
    price: number;
    description: string;
    details: Record<string, string>;
    isPublic: boolean;
    onStock: boolean;
    isFeatured: boolean;
    sale: boolean;
    salePrice: number | null;
    saleEndDate: string | null;
    images: ProductImageAsset[];
    mainImageIndex: number | null;
};

type SubmitErrorData = {
    error?: string;
    fieldErrors?: Partial<
        Record<
            "name" | "price" | "description" | "details" | "isPublic" | "onStock" | "isFeatured" | "salePrice",
            string
        >
    >;
};

type ProductFormProps = {
    defaultValues: ProductFormValues;
    defaultImages?: ProductImageAsset[];
    defaultMainImageIndex?: number | null;
    submitLabel: string;
    loadingLabel: string;
    showSaleFields?: boolean;
    isSaving?: boolean;
    onSubmit: (values: ProductFormSubmitValues) => Promise<void>;
};

const MAX_DETAILS = 10;
const visibilityOptions = ["public", "draft"] as const;

function parsePrice(value: string) {
    return Number(value.replace(",", "."));
}

function getSubmitErrorData(error: unknown) {
    if (typeof error !== "object" || !error || !("data" in error)) return undefined;

    const data = (error as { data?: unknown }).data;

    return typeof data === "object" && data ? (data as SubmitErrorData) : undefined;
}

function FieldError({ message }: { message?: string }) {
    return message ? <Text className="text-xs text-destructive">{message}</Text> : null;
}

function ProductForm({
    defaultValues,
    defaultImages = [],
    defaultMainImageIndex = null,
    submitLabel,
    loadingLabel,
    showSaleFields = false,
    isSaving: isExternallySaving = false,
    onSubmit,
}: ProductFormProps) {
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [images, setImages] = useState<ProductImageAsset[]>(defaultImages);
    const [mainImageIndex, setMainImageIndex] = useState<number | null>(defaultMainImageIndex);
    const {
        control,
        clearErrors,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormValues>({ defaultValues });
    const { append, fields, remove } = useFieldArray({ control, name: "details" });
    const isSaving = isSubmitting || isExternallySaving;
    const canAddDetail = fields.length < MAX_DETAILS;
    const scrollAmount = useScrollAmount();
    const handleScroll = useAnimatedScrollHandler({
        onScroll: (event) => {
            if (scrollAmount) scrollAmount.value = event.contentOffset.y;
        },
    });

    useEffect(() => {
        reset(defaultValues);
        setImages(defaultImages);
        setMainImageIndex(defaultMainImageIndex);
    }, [defaultImages, defaultMainImageIndex, defaultValues, reset]);

    useEffect(() => {
        if (scrollAmount) scrollAmount.value = 0;

        return () => {
            if (scrollAmount) scrollAmount.value = 0;
        };
    }, [scrollAmount]);

    const getDetailsRecord = (details: ProductDetail[]) => {
        const detailRecord: Record<string, string> = {};
        const titles = new Set<string>();
        let hasErrors = false;

        details.forEach((detail, index) => {
            const title = detail.title.trim();
            const description = detail.description.trim();

            if (!title && !description) return;

            if (!title) {
                setError(`details.${index}.title`, { message: "Detail title is required." });
                hasErrors = true;
            }

            if (!description) {
                setError(`details.${index}.description`, {
                    message: "Detail description is required.",
                });
                hasErrors = true;
            }

            if (title && titles.has(title)) {
                setError(`details.${index}.title`, { message: "Detail title must be unique." });
                hasErrors = true;
            }

            titles.add(title);

            if (title && description) detailRecord[title] = description;
        });

        return hasErrors ? null : detailRecord;
    };

    const submit = async (values: ProductFormValues) => {
        setSubmitError(null);
        clearErrors("details");
        clearErrors("salePrice");

        const details = getDetailsRecord(values.details);

        if (!details) return;

        const salePrice = values.sale ? parsePrice(values.salePrice) : null;

        if (showSaleFields && values.sale && (salePrice === null || !Number.isFinite(salePrice) || salePrice <= 0)) {
            setError("salePrice", { message: "Sale price must be greater than 0." });
            return;
        }

        try {
            await onSubmit({
                name: values.name.trim(),
                price: parsePrice(values.price),
                description: values.description.trim(),
                details,
                isPublic: values.visibility === "public",
                onStock: values.onStock,
                isFeatured: values.isFeatured,
                sale: showSaleFields ? values.sale : false,
                salePrice: showSaleFields ? salePrice : null,
                saleEndDate: showSaleFields && values.saleEndDate ? values.saleEndDate.toISOString() : null,
                images,
                mainImageIndex,
            });
        } catch (error) {
            const data = getSubmitErrorData(error);

            Object.entries(data?.fieldErrors ?? {}).forEach(([field, message]) => {
                if (
                    (field === "name" ||
                        field === "price" ||
                        field === "description" ||
                        field === "salePrice") &&
                    message
                ) {
                    setError(field, { message });
                }
            });

            setSubmitError(
                data?.fieldErrors?.details ?? data?.error ?? "Unable to save product. Please try again.",
            );
        }
    };

    return (
        <View className="flex-1">
            <Animated.ScrollView
                className="flex-1 bg-background"
                contentContainerClassName="gap-7 px-6 pb-8"
                keyboardShouldPersistTaps="handled"
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <ProductMediaUpload
                    images={images}
                    mainImageIndex={mainImageIndex}
                    onImagesChange={setImages}
                    onMainImageIndexChange={setMainImageIndex}
                    disabled={isSaving}
                />

                <View className="gap-4">
                    <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                        Basic Information
                    </Text>
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">Product Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            rules={{
                                validate: (value) => value.trim().length > 0 || "Product name is required.",
                            }}
                            render={({ field: { onBlur, onChange, value } }) => (
                                <Input
                                    editable={!isSaving}
                                    placeholder="e.g. Handmade Ceramic Vase"
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
                        <Text className="font-jakarta-bold">Price</Text>
                        <Controller
                            control={control}
                            name="price"
                            rules={{
                                validate: (value) => {
                                    if (!value.trim()) return "Price is required.";

                                    const price = parsePrice(value);

                                    return (
                                        (Number.isFinite(price) && price > 0) ||
                                        "Price must be greater than 0."
                                    );
                                },
                            }}
                            render={({ field: { onBlur, onChange, value } }) => (
                                <IconInput
                                    icon={CoinsIcon}
                                    editable={!isSaving}
                                    placeholder="0.00"
                                    keyboardType="decimal-pad"
                                    inputMode="decimal"
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    className={cn(errors.price && "border-destructive")}
                                />
                            )}
                        />
                        <FieldError message={errors.price?.message} />
                    </View>
                    {showSaleFields && (
                        <Card className="gap-3 rounded-3xl px-4 py-4">
                            <Controller
                                control={control}
                                name="sale"
                                render={({ field: { onChange, value } }) => (
                                    <View className="flex-row items-center gap-3">
                                        <IconCircle icon={TagIcon} />
                                        <View className="flex-1">
                                            <Text className="font-jakarta-bold">Enable Sale</Text>
                                            <Text variant={"muted"} className="text-xs">
                                                Show a temporary promotional price
                                            </Text>
                                        </View>
                                        <Switch
                                            value={value}
                                            onValueChange={onChange}
                                            disabled={isSaving}
                                            trackColor={{ false: "#e5e7eb", true: "#13a4ec" }}
                                            thumbColor="#ffffff"
                                            ios_backgroundColor="#e5e7eb"
                                            accessibilityLabel="Enable Sale"
                                        />
                                    </View>
                                )}
                            />
                            <Controller
                                control={control}
                                name="sale"
                                render={({ field: { value } }) =>
                                    value ? (
                                        <View className="gap-4 rounded-3xl bg-card p-4 shadow-sm shadow-black/5">
                                            <Controller
                                                control={control}
                                                name="salePrice"
                                                render={({ field: { onBlur, onChange, value } }) => (
                                                    <IconInput
                                                        icon={CoinsIcon}
                                                        editable={!isSaving}
                                                        placeholder="Sale price"
                                                        keyboardType="decimal-pad"
                                                        inputMode="decimal"
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        className={cn(
                                                            errors.salePrice && "border-destructive",
                                                        )}
                                                    />
                                                )}
                                            />
                                            <FieldError message={errors.salePrice?.message} />
                                            <Controller
                                                control={control}
                                                name="saleEndDate"
                                                render={({ field: { onChange, value } }) => (
                                                    <DateTimeInput
                                                        mode="date"
                                                        placeholder="End Date (optional)"
                                                        value={value}
                                                        onDateChange={onChange}
                                                    />
                                                )}
                                            />
                                        </View>
                                    ) : (<></>)
                                }
                            />
                        </Card>
                    )}
                    <View className="gap-2">
                        <Text className="font-jakarta-bold">Description</Text>
                        <Controller
                            control={control}
                            name="description"
                            rules={{
                                validate: (value) => value.trim().length > 0 || "Description is required.",
                            }}
                            render={({ field: { onBlur, onChange, value } }) => (
                                <Textarea
                                    editable={!isSaving}
                                    placeholder="Tell customers more about this item..."
                                    className={cn("min-h-32", errors.description && "border-destructive")}
                                    value={value}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                />
                            )}
                        />
                        <FieldError message={errors.description?.message} />
                    </View>
                </View>

                <View className="gap-4">
                    <View className="flex-row items-center gap-3">
                        <Text className="flex-1 text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                            Details
                        </Text>
                        <Button
                            variant="secondary"
                            className="h-10 rounded-full px-4"
                            disabled={isSaving || !canAddDetail}
                            onPress={() => append({ title: "", description: "" })}
                        >
                            <PlusIcon size={18} className="text-secondary-foreground" />
                            <Text className="font-jakarta-bold">Add Detail</Text>
                        </Button>
                    </View>

                    {fields.length === 0 ? (
                        <Text variant="muted">No details added.</Text>
                    ) : (
                        <View className="gap-3">
                            {fields.map((field, index) => {
                                const detailError = errors.details?.[index];

                                return (
                                    <View
                                        key={field.id}
                                        className="gap-3 rounded-3xl border border-border bg-card p-4"
                                    >
                                        <View className="flex-row items-center gap-3">
                                            <Text className="flex-1 font-jakarta-bold">
                                                Detail {index + 1}
                                            </Text>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={isSaving}
                                                accessibilityLabel={`Remove detail ${index + 1}`}
                                                onPress={() => remove(index)}
                                            >
                                                <Trash2Icon size={20} className="text-destructive" />
                                            </Button>
                                        </View>
                                        <View className="gap-2">
                                            <Text className="font-jakarta-bold">Title</Text>
                                            <Controller
                                                control={control}
                                                name={`details.${index}.title`}
                                                render={({ field: { onBlur, onChange, value } }) => (
                                                    <Input
                                                        editable={!isSaving}
                                                        placeholder="e.g. DPI"
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        className={cn(
                                                            detailError?.title && "border-destructive",
                                                        )}
                                                    />
                                                )}
                                            />
                                            <FieldError message={detailError?.title?.message} />
                                        </View>
                                        <View className="gap-2">
                                            <Text className="font-jakarta-bold">Description</Text>
                                            <Controller
                                                control={control}
                                                name={`details.${index}.description`}
                                                render={({ field: { onBlur, onChange, value } }) => (
                                                    <Input
                                                        editable={!isSaving}
                                                        placeholder="e.g. 2300"
                                                        value={value}
                                                        onBlur={onBlur}
                                                        onChangeText={onChange}
                                                        className={cn(
                                                            detailError?.description &&
                                                                "border-destructive",
                                                        )}
                                                    />
                                                )}
                                            />
                                            <FieldError message={detailError?.description?.message} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </View>

                <View className="gap-4">
                    <Text className="text-xs font-jakarta-extrabold uppercase text-muted-foreground">
                        Inventory & Visibility
                    </Text>
                    <View className="overflow-hidden rounded-3xl border border-border bg-card">
                        <Controller
                            control={control}
                            name="onStock"
                            render={({ field: { onChange, value } }) => (
                                <Pressable
                                    className="flex-row items-center gap-3 border-b border-border px-4 py-4"
                                    onPress={() => onChange(!value)}
                                    disabled={isSaving}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: value, disabled: isSaving }}
                                >
                                    <PackageIcon size={20} className="text-muted-foreground" />
                                    <View className="flex-1">
                                        <Text className="font-jakarta-bold">In Stock</Text>
                                        <Text variant={"muted"} className="text-xs">
                                            Available for customers to buy
                                        </Text>
                                    </View>
                                    <CheckControl checked={value} />
                                </Pressable>
                            )}
                        />
                        <Controller
                            control={control}
                            name="isFeatured"
                            render={({ field: { onChange, value } }) => (
                                <Pressable
                                    className="flex-row items-center gap-3 border-b border-border px-4 py-4"
                                    onPress={() => onChange(!value)}
                                    disabled={isSaving}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{ checked: value, disabled: isSaving }}
                                >
                                    <StarIcon size={20} className="text-muted-foreground" />
                                    <View className="flex-1">
                                        <Text className="font-jakarta-bold">Feature in Catalog</Text>
                                        <Text variant={"muted"} className="text-xs">
                                            Highlight at the top of your shop
                                        </Text>
                                    </View>
                                    <CheckControl checked={value} />
                                </Pressable>
                            )}
                        />
                        <View className="flex-row items-center gap-3 px-4 py-4">
                            <EyeIcon size={20} className="text-muted-foreground" />
                            <View className="flex-1 gap-3">
                                <View>
                                    <Text className="font-jakarta-bold">Visibility</Text>
                                    <Text variant={"muted"} className="text-xs">
                                        Choose whether customers can see this product
                                    </Text>
                                </View>
                                <Controller
                                    control={control}
                                    name="visibility"
                                    render={({ field: { onChange, value } }) => (
                                        <View className="flex-row rounded-full bg-secondary p-1">
                                            {visibilityOptions.map((option) => {
                                                const selected = value === option;

                                                return (
                                                    <Pressable
                                                        key={option}
                                                        className={cn(
                                                            "h-10 flex-1 items-center justify-center rounded-full",
                                                            selected && "bg-card",
                                                        )}
                                                        onPress={() => onChange(option)}
                                                        disabled={isSaving}
                                                        accessibilityRole="radio"
                                                        accessibilityState={{
                                                            checked: selected,
                                                            disabled: isSaving,
                                                        }}
                                                    >
                                                        <Text
                                                            className={cn(
                                                                "text-sm font-jakarta-bold capitalize",
                                                                selected
                                                                    ? "text-foreground"
                                                                    : "text-muted-foreground",
                                                            )}
                                                        >
                                                            {option}
                                                        </Text>
                                                    </Pressable>
                                                );
                                            })}
                                        </View>
                                    )}
                                />
                            </View>
                        </View>
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

            {isSaving && (
                <View className="absolute inset-0 items-center justify-center bg-black/70">
                    <ActivityIndicator size="large" color="white" />
                    <Text className="mt-3 font-jakarta-bold text-white">{loadingLabel}</Text>
                </View>
            )}
        </View>
    );
}

export default ProductForm;
export type { ProductFormSubmitValues, ProductFormValues };
