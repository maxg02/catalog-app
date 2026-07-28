import { cookies } from "next/headers";
import { mapBusinessProfileRowToDto } from "@/lib/mappers/userBusinessMapper";
import { parseBusinessBody, validateBusinessBody } from "@/lib/business/businessRequest";
import { syncBusinessBanner, validateBanner } from "@/lib/business/banners/banner";
import { createClient } from "@/utils/supabase/server";
import type { BusinessProfileRow } from "@/interfaces";

const BUSINESSES_TABLE = "businesses";
const BUSINESS_SELECT = "id,name,description,category,location,user_id,business_images(image_url)";
type UserBusinessesRouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: UserBusinessesRouteContext) {
    const userId = Number((await params).id);
    if (!Number.isInteger(userId) || userId < 1) return Response.json({ error: "Invalid user id" }, { status: 400 });
    const body = await parseBusinessBody(request);
    if (!body) return Response.json({ error: "Invalid request body" }, { status: 400 });
    const result = validateBusinessBody(body);
    const banner = validateBanner(body, "remove");
    if (!result.ok || !banner.ok) return Response.json({ error: "Please fix the highlighted fields.", fieldErrors: { ...(result.ok ? {} : result.fieldErrors), ...(banner.ok ? {} : banner.fieldErrors) } }, { status: 400 });
    const supabase = createClient(await cookies());
    const { data: business, error } = await supabase.from(BUSINESSES_TABLE).insert({ ...result.business, user_id: userId }).select("id").single();
    if (error) return Response.json({ error: "Error creating business" }, { status: 500 });
    try { await syncBusinessBanner(supabase, business.id, banner.banner); } catch (error) { console.error("Error creating business banner:", error); await supabase.from(BUSINESSES_TABLE).delete().eq("id", business.id); return Response.json({ error: "Unable to save business banner." }, { status: 502 }); }
    const { data: created, error: refetchError } = await supabase.from(BUSINESSES_TABLE).select(BUSINESS_SELECT).eq("id", business.id).single();
    if (refetchError) return Response.json({ error: "Error fetching created business" }, { status: 500 });
    return Response.json(mapBusinessProfileRowToDto(created as BusinessProfileRow), { status: 201 });
}
