import React from "react";
import { useRouter } from "expo-router";
import { Image, View } from "react-native";
import {
    BoxIcon,
    CircleIcon,
    MoreVerticalIcon,
    PencilIcon,
    StarIcon,
    Trash2Icon,
} from "lucide-nativewind";
import type { CatalogProductDto } from "@internal/interfaces";
import AlertDialog from "@/components/ui/alertDialog";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import DropdownMenu, { type DropdownMenuAction } from "@/components/ui/dropdownMenu";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type CatalogProductCardProps = CatalogProductDto & {
    isDeleting?: boolean;
    onDelete: () => Promise<void>;
};

function CatalogProductCard({ isDeleting = false, onDelete, ...product }: CatalogProductCardProps) {
    const router = useRouter();
    const [isDeleteAlertVisible, setIsDeleteAlertVisible] = React.useState(false);
    const [isDeleteErrorVisible, setIsDeleteErrorVisible] = React.useState(false);
    const price = product.sale ? product.salePrice : product.price;
    const currentPrice = `$${price?.toFixed(2)}`;
    const originalPrice = `$${product.price.toFixed(2)}`;

    const stockText = product.onStock ? "In stock" : "Out of stock";
    const stockClassName = cn(
        "text-sm font-jakarta-medium",
        product.onStock ? "text-muted-foreground" : "text-red-300",
    );

    const editProduct = () => {
        router.push({ pathname: "/catalog/[id]", params: { id: product.id } });
    };

    const deleteProduct = async () => {
        setIsDeleteAlertVisible(false);

        try {
            await onDelete();
        } catch {
            setIsDeleteErrorVisible(true);
        }
    };

    const confirmDelete = () => {
        setIsDeleteAlertVisible(true);
    };

    const actions: DropdownMenuAction[] = [
        { key: "edit", label: "Edit", icon: PencilIcon, onPress: editProduct },
        {
            key: "delete",
            label: "Delete",
            icon: Trash2Icon,
            destructive: true,
            disabled: isDeleting,
            onPress: confirmDelete,
        },
    ];

    return (
        <>
            <Card className="p-3">
                <View className="flex-row gap-3">
                    <View className="w-24 overflow-hidden rounded-2xl bg-muted relative">
                        {product.mainImage ? (
                            <Image
                                source={{ uri: product.mainImage }}
                                className="flex-grow flex-shrink-0 h-24"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="my-auto mx-auto opacity-30">
                                <BoxIcon className="text-white" size={30} />
                            </View>
                        )}
                        {product.isFeatured && (
                            <StarIcon
                                className="absolute top-2 left-2 fill-yellow-400 stroke-none"
                                size={15}
                            />
                        )}
                    </View>
                    <View className="flex-1 justify-between gap-2">
                        <View className="gap-1 items-start">
                            <Text variant={"h3"} numberOfLines={2} className="w-full font-jakarta-bold">
                                {product.name}
                            </Text>
                            <View className="flex-row gap-2">
                                <Badge variant={product.isPublic ? "default" : "muted"}>
                                    <CircleIcon className="stroke-none fill-card" size={10} />
                                    <Text>{product.isPublic ? "Public" : "Draft"}</Text>
                                </Badge>
                                {product.sale && (
                                    <Badge variant={"warning"}>
                                        <CircleIcon className="stroke-none fill-card" size={10} />
                                        <Text>Sale</Text>
                                    </Badge>
                                )}
                            </View>

                            <View className="w-full">
                                {product.sale ? (
                                    <View>
                                        <View className="flex-row gap-2 items-center">
                                            <Text className="font-jakarta-bold text-primary">
                                                {currentPrice}
                                            </Text>
                                            <Text className="line-through text-muted-foreground/20">
                                                {originalPrice}
                                            </Text>
                                        </View>
                                        <Text className={stockClassName}>{stockText}</Text>
                                    </View>
                                ) : (
                                    <View className="flex-row gap-2 items-center">
                                        <Text className="font-jakarta-bold text-primary">{currentPrice}</Text>
                                        <CircleIcon className="stroke-none fill-muted-foreground" size={5} />
                                        <Text className={stockClassName}>{stockText}</Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                    <View className="items-end justify-center">
                        <DropdownMenu
                            actions={actions}
                            disabled={isDeleting}
                            trigger={<MoreVerticalIcon className="text-primary" size={20} />}
                            triggerAccessibilityLabel={`Open actions for ${product.name}`}
                        />
                    </View>
                </View>
            </Card>
            <AlertDialog
                visible={isDeleteAlertVisible}
                title="Delete product?"
                description={`Delete ${product.name}? This cannot be undone.`}
                icon={Trash2Icon}
                iconClassName="text-destructive"
                iconContainerClassName="bg-destructive/10"
                onClose={() => setIsDeleteAlertVisible(false)}
                secondaryAction={{
                    label: "Cancel",
                    onPress: () => setIsDeleteAlertVisible(false),
                }}
                primaryAction={{
                    label: "Delete",
                    variant: "destructive",
                    disabled: isDeleting,
                    onPress: () => void deleteProduct(),
                }}
            />
            <AlertDialog
                visible={isDeleteErrorVisible}
                title="Unable to delete product"
                description="Please try again."
                icon={Trash2Icon}
                iconClassName="text-destructive"
                iconContainerClassName="bg-destructive/10"
                onClose={() => setIsDeleteErrorVisible(false)}
                primaryAction={{
                    label: "OK",
                    onPress: () => setIsDeleteErrorVisible(false),
                }}
            />
        </>
    );
}

export default CatalogProductCard;
export type { CatalogProductCardProps };
