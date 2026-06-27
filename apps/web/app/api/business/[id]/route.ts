import { cookies } from "next/headers";
import { mapUserBusinessRowToDto } from "@/lib/mappers/userBusinessMapper";
import { createClient } from "@/utils/supabase/server";
import type { UserBusinessRow } from "@/interfaces";

const USER_BUSINESSES_TABLE = "user_businesses";
const USER_BUSINESS_SELECT = "id,name,email,banner_image,description,category,location,user_role";

type BusinessRouteContext = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(_request: Request, { params }: BusinessRouteContext) {
    const { id } = await params;
    const businessId = Number(id);

    if (!Number.isInteger(businessId) || businessId < 1) {
        return Response.json({ error: "Invalid business id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: userBusiness, error } = await supabase
        .from(USER_BUSINESSES_TABLE)
        .select(USER_BUSINESS_SELECT)
        .eq("id", businessId)
        .maybeSingle();

    if (error) {
        console.error("Error fetching business:", error);

        return Response.json({ error: "Error fetching business" }, { status: 500 });
    }

    if (!userBusiness) {
        return Response.json({ error: "Business not found" }, { status: 404 });
    }

    return Response.json(mapUserBusinessRowToDto(userBusiness as UserBusinessRow));
}
