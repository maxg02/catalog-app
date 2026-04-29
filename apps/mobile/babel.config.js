module.exports = function (api) {
    api.cache(true);
    return {
        presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
        plugins: [
            "nativewind/babel",
            "react-native-reanimated/plugin", // ⚠️ SIEMPRE el último
        ],
    };
};
