import { businessInsights } from "@internal/mock-data";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
    await delay(10000);
    console.log("Simulating network delay...");

    return Response.json(businessInsights);
}
