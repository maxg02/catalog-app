import { createContext, useContext } from "react";
import { SharedValue } from "react-native-reanimated";

type ScrollAmountContextValue =
    | SharedValue<number>
    | {
          defaultValue: SharedValue<number>;
          routeValues: Record<string, SharedValue<number>>;
      };

export const ScrollAmountContext = createContext<ScrollAmountContextValue | null>(null);

export function useScrollAmount(routeName?: string) {
    const scrollAmount = useContext(ScrollAmountContext);

    if (!scrollAmount) {
        return null;
    }

    if ("value" in scrollAmount) {
        return scrollAmount;
    }

    if (routeName) {
        return scrollAmount.routeValues[routeName] ?? scrollAmount.defaultValue;
    }

    return scrollAmount.defaultValue;
}
