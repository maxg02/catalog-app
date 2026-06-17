import React from "react";
import { View } from "react-native";
import { MapPinIcon } from "lucide-nativewind";
import IconCircle from "@/components/ui/iconCircle";
import { Camera, Map, ViewAnnotation } from "@maplibre/maplibre-react-native";

type BusinessLocationMapProps = {
    interactive?: boolean;
};

const BUSINESS_COORDINATES: [number, number] = [-69.8413349302188, 18.512757547381085];
const MAP_STYLE_URL =
    "https://raw.githubusercontent.com/go2garret/maps/main/src/assets/json/openStreetMap.json";

function BusinessLocationMap({ interactive = true }: BusinessLocationMapProps) {
    return (
        <Map
            mapStyle={MAP_STYLE_URL}
            attribution={false}
            logo={false}
            dragPan={interactive}
            touchZoom={interactive}
            doubleTapZoom={interactive}
            doubleTapHoldZoom={interactive}
            touchRotate={interactive}
            touchPitch={interactive}
            pointerEvents={interactive ? "auto" : "none"}
        >
            <Camera center={BUSINESS_COORDINATES} zoom={15} />
            <ViewAnnotation lngLat={BUSINESS_COORDINATES} anchor="center">
                <View>
                    <IconCircle
                        icon={MapPinIcon}
                        className="bg-primary h-8 w-8"
                        iconClassName="text-white"
                    />
                </View>
            </ViewAnnotation>
        </Map>
    );
}

export default BusinessLocationMap;
export type { BusinessLocationMapProps };
