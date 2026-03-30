import { vars } from "nativewind";
import { useColorScheme, View } from "react-native";
import { THEME } from "@/lib/theme";
import { cn } from "@/lib/utils";

type Props = {
    children: React.ReactNode;
};

export function AppThemeProvider({ children }: Props) {
    const scheme = useColorScheme();
    const current = scheme === "dark" ? THEME.dark : THEME.light;

    return (
        <View
            style={vars({
                "--background": current.background,
                "--foreground": current.foreground,
                "--card": current.card,
                "--card-foreground": current.cardForeground,
                "--primary": current.primary,
                "--primary-foreground": current.primaryForeground,
                "--secondary": current.secondary,
                "--secondary-foreground": current.secondaryForeground,
                "--muted": current.muted,
                "--muted-foreground": current.mutedForeground,
                "--accent": current.accent,
                "--accent-foreground": current.accentForeground,
                "--destructive": current.destructive,
                "--border": current.border,
                "--ring": current.ring,
                "--input": current.input,
            })}
            className={cn("flex-1", scheme === "dark" && "dark")}
        >
            {children}
        </View>
    );
}
