import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

export const CartScrollAmountContext = createContext<SharedValue<number> | null>(null);

export function useCartScrollAmount() {
    return useContext(CartScrollAmountContext);
}
