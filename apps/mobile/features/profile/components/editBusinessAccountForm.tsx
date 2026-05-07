import React from "react";
import { View } from "react-native";
import {
    Building2Icon,
    ImageIcon,
    LockIcon,
    MailIcon,
    SaveIcon,
} from "lucide-nativewind";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/iconInput";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import BusinessBannerUpload from "@/features/profile/components/businessBannerUpload";
import BusinessCategorySelector from "@/features/profile/components/businessCategorySelector";
import BusinessLocationCard from "@/features/profile/components/businessLocationCard";
import type { UserBusinessDto } from "interfaces";

type EditBusinessAccountFormProps = {
    business: UserBusinessDto;
};

function EditBusinessAccountForm({ business }: EditBusinessAccountFormProps) {
    return (
        <>
            <BusinessBannerUpload imageUrl={business.bannerImage} />

            <View className="gap-4">
                <Text variant={"h4"}>ACCOUNT</Text>
                <View className="gap-2">
                    <Text variant={"h3"}>Email</Text>
                    <IconInput
                        icon={MailIcon}
                        defaultValue={business.email}
                        placeholder="business@email.com"
                        keyboardType="email-address"
                        inputMode="email"
                        autoCapitalize="none"
                    />
                </View>
                <View className="gap-2">
                    <Text variant={"h3"}>Password</Text>
                    <IconInput
                        icon={LockIcon}
                        placeholder="New password"
                        secureTextEntry
                        textContentType="newPassword"
                    />
                </View>
            </View>

            <View className="gap-4">
                <Text variant={"h4"}>BUSINESS INFORMATION</Text>
                <View className="gap-2">
                    <Text variant={"h3"}>Business Name</Text>
                    <IconInput
                        icon={Building2Icon}
                        defaultValue={business.name}
                        placeholder="Business name"
                    />
                </View>
                <View className="gap-2">
                    <Text variant={"h3"}>Category</Text>
                    <BusinessCategorySelector initialCategory={business.category} />
                </View>
                <View className="gap-2">
                    <Text variant={"h3"}>Description</Text>
                    <Textarea
                        defaultValue={business.description}
                        placeholder="Tell customers what makes your business special..."
                        className="min-h-36"
                    />
                </View>
            </View>

            <BusinessLocationCard location={business.location} />

            <Button className="h-14 rounded-full">
                <SaveIcon size={20} className="text-primary-foreground" />
                <Text className="font-jakarta-bold">Update Account</Text>
            </Button>
        </>
    );
}

export default EditBusinessAccountForm;
export type { EditBusinessAccountFormProps };
