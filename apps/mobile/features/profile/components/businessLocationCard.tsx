import React, { useEffect, useMemo, useState } from "react";
import { Switch, View } from "react-native";
import { MapPinIcon } from "lucide-nativewind";
import Card from "@/components/ui/card";
import IconCircle from "@/components/ui/iconCircle";
import { IconInput } from "@/components/ui/iconInput";
import SearchableSelect from "@/components/ui/searchableSelect";
import { Text } from "@/components/ui/text";
import { useGetCountriesQuery, useGetStatesQuery } from "@/features/profile/api/profileApi";
import type { BusinessLocationDto } from "@internal/interfaces";

type BusinessLocationCardProps = {
    location: BusinessLocationDto | null;
};

const EMPTY_LOCATION: BusinessLocationDto = {
    address: "",
    city: "",
    country: "",
};

function BusinessLocationCard({ location }: BusinessLocationCardProps) {
    const initialLocation = location ?? EMPTY_LOCATION;
    const [isLocationEnabled, setIsLocationEnabled] = useState(Boolean(location));
    const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
    const [selectedStateCode, setSelectedStateCode] = useState<string | null>(null);

    const {
        data: countries = [],
        isError: isCountriesError,
        isLoading: isCountriesLoading,
    } = useGetCountriesQuery(undefined, {
        skip: !isLocationEnabled,
    });

    const {
        data: states = [],
        isError: isStatesError,
        isLoading: isStatesLoading,
    } = useGetStatesQuery(selectedCountryCode ?? "", {
        skip: !isLocationEnabled || !selectedCountryCode,
    });

    const countryOptions = useMemo(
        () =>
            countries.map((country) => ({
                label: country.name,
                value: country.id,
            })),
        [countries],
    );

    const stateOptions = useMemo(
        () =>
            states.map((state) => ({
                label: state.name,
                value: state.stateCode,
            })),
        [states],
    );

    const countryPlaceholder = isCountriesLoading ? "Loading countries..." : "Select country";
    const countryEmptyMessage = isCountriesError ? "Unable to load countries" : "No countries found";
    const statePlaceholder = !selectedCountryCode
        ? "Select a country first"
        : isStatesLoading
          ? "Loading states..."
          : "Select state";
    const stateEmptyMessage = isStatesError ? "Unable to load states" : "No states found";
    const isStateSelectDisabled = !selectedCountryCode || isStatesLoading;

    useEffect(() => {
        if (!isLocationEnabled || selectedCountryCode || countries.length === 0) {
            return;
        }

        const matchingCountry = countries.find(
            (country) =>
                country.name === initialLocation.country || country.id === initialLocation.country,
        );

        if (matchingCountry) {
            setSelectedCountryCode(matchingCountry.id);
        }
    }, [countries, initialLocation.country, isLocationEnabled, selectedCountryCode]);

    const handleCountryChange = (countryCode: string) => {
        setSelectedCountryCode(countryCode);
        setSelectedStateCode(null);
    };

    const handleLocationEnabledChange = (enabled: boolean) => {
        setIsLocationEnabled(enabled);

        if (!enabled) {
            setSelectedCountryCode(null);
            setSelectedStateCode(null);
        }
    };

    return (
        <Card className="gap-4 px-5 py-5">
            <View className="flex-row items-start gap-3">
                <IconCircle icon={MapPinIcon} />
                <View className="flex-1 gap-1">
                    <Text variant={"h3"}>Business Location</Text>
                    <Text variant={"muted"} className="text-xs leading-5">
                        Your physical headquarters or service areas.
                    </Text>
                </View>
                <View className="my-auto">
                    <Switch value={isLocationEnabled} onValueChange={handleLocationEnabledChange} />
                </View>
            </View>

            {isLocationEnabled ? (
                <>
                    <View className="gap-2">
                        <Text variant={"h3"}>Country</Text>
                        <SearchableSelect
                            options={countryOptions}
                            value={selectedCountryCode}
                            onValueChange={handleCountryChange}
                            disabled={isCountriesLoading}
                            emptyMessage={countryEmptyMessage}
                            placeholder={countryPlaceholder}
                            searchPlaceholder="Search countries..."
                        />
                        {isCountriesError && (
                            <Text variant={"muted"} className="text-xs">
                                Check your connection and try again.
                            </Text>
                        )}
                    </View>

                    <View className="gap-2">
                        <Text variant={"h3"}>State</Text>
                        <SearchableSelect
                            options={stateOptions}
                            value={selectedStateCode}
                            onValueChange={setSelectedStateCode}
                            disabled={isStateSelectDisabled}
                            emptyMessage={stateEmptyMessage}
                            placeholder={statePlaceholder}
                            searchPlaceholder="Search states..."
                        />
                        {isStatesError && (
                            <Text variant={"muted"} className="text-xs">
                                Check your connection and try again.
                            </Text>
                        )}
                    </View>

                    <View className="gap-2">
                        <Text variant={"h3"}>Address</Text>
                        <IconInput
                            icon={MapPinIcon}
                            defaultValue={initialLocation.address}
                            placeholder="Street address"
                            iconSize={18}
                            inputClassName="text-sm"
                        />
                    </View>
                </>
            ) : (
                <Text variant={"muted"} className="text-xs leading-5">
                    Turn on location if you want customers to see where your business operates.
                </Text>
            )}
        </Card>
    );
}

export default BusinessLocationCard;
export type { BusinessLocationCardProps };
