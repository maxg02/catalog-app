import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export const ScrollAmountContext = createContext<SharedValue<number> | null>(null);

export function useScrollAmount() {
    return useContext(ScrollAmountContext);
}
