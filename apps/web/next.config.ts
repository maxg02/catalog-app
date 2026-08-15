import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        "local-origin.dev",
        "*.local-origin.dev",
        "192.168.1.107",
        "192.168.1.100",
        "192.168.100.5",
        "localhost",
    ],
};

export default nextConfig;
