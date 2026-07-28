import { cookies } from "next/headers";
import { mapBusinessProfileRowToDto, mapUserRowToDto } from "@/lib/mappers/userBusinessMapper";
import { createClient } from "@/utils/supabase/server";
import type { BusinessProfileRow, UserRow } from "@/interfaces";

const USERS_TABLE = "users";
const BUSINESSES_TABLE = "businesses";
const USER_SELECT = "id,name,email,role";
const BUSINESS_SELECT = "id,name,description,category,location,user_id,business_images(image_url)";

type UserProfileRouteContext = {
    params: Promise<{ id: string }>;
};

function getUserId(id: string) {
    const userId = Number(id);

    return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function GET(_request: Request, { params }: UserProfileRouteContext) {
    const { id } = await params;
    const userId = getUserId(id);

    if (!userId) {
        return Response.json({ error: "Invalid user id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: user, error: userError } = await supabase
        .from(USERS_TABLE)
        .select(USER_SELECT)
        .eq("id", userId)
        .maybeSingle();

    if (userError) {
        console.error("Error fetching user:", userError);

        return Response.json({ error: "Error fetching user" }, { status: 500 });
    }

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { data: businesses, error: businessesError } = await supabase
        .from(BUSINESSES_TABLE)
        .select(BUSINESS_SELECT)
        .eq("user_id", userId)
        .order("id", { ascending: true });

    if (businessesError) {
        console.error("Error fetching businesses:", businessesError);

        return Response.json({ error: "Error fetching businesses" }, { status: 500 });
    }

    return Response.json({
        user: mapUserRowToDto(user as UserRow),
        businesses: ((businesses ?? []) as BusinessProfileRow[]).map(mapBusinessProfileRowToDto),
    });
}


