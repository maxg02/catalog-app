import { businessInsights } from "@internal/mock-data";

type BusinessInsightsRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_request: Request, { params }: BusinessInsightsRouteContext) {
    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId) || businessId < 1) {
        return Response.json({ error: "Invalid business id" }, { status: 400 });
    }

    return Response.json(businessInsights);
}
