import { cookies } from "next/headers";
import { mapBusinessProfileRowToDto } from "@/lib/mappers/userBusinessMapper";
import { parseBusinessBody, validateBusinessBody } from "@/lib/business/businessRequest";
import { syncBusinessBanner, validateBanner } from "@/lib/business/banners/banner";
import { getBusinessImageUrls } from "@/lib/business/businessImages";
import { deleteImageUrlsFromR2 } from "@/lib/products/productRequest";
import { createClient } from "@/utils/supabase/server";
import type { BusinessProfileRow } from "@/interfaces";

const DEMO_USER_ID = 1;
const BUSINESSES_TABLE = "businesses";
const BUSINESS_SELECT = "id,name,description,category,location,user_id,business_images(image_url)";
type BusinessRouteContext = { params: Promise<{ id: string }> };

function getBusinessId(id: string) {
    const businessId = Number(id);
    return Number.isInteger(businessId) && businessId > 0 ? businessId : null;
}

export async function GET(_request: Request, { params }: BusinessRouteContext) {
    const businessId = getBusinessId((await params).id);
    if (!businessId) return Response.json({ error: "Invalid business id" }, { status: 400 });
    const supabase = createClient(await cookies());
    const { data: business, error } = await supabase.from(BUSINESSES_TABLE).select(BUSINESS_SELECT).eq("id", businessId).maybeSingle();
    if (error) return Response.json({ error: "Error fetching business" }, { status: 500 });
    if (!business) return Response.json({ error: "Business not found" }, { status: 404 });
    return Response.json(mapBusinessProfileRowToDto(business as BusinessProfileRow));
}

export async function PUT(request: Request, { params }: BusinessRouteContext) {
    const businessId = getBusinessId((await params).id);
    if (!businessId) return Response.json({ error: "Invalid business id" }, { status: 400 });
    const body = await parseBusinessBody(request);
    if (!body) return Response.json({ error: "Invalid request body" }, { status: 400 });
    const result = validateBusinessBody(body);
    const banner = validateBanner(body, "keep");
    if (!result.ok || !banner.ok) return Response.json({ error: "Please fix the highlighted fields.", fieldErrors: { ...(result.ok ? {} : result.fieldErrors), ...(banner.ok ? {} : banner.fieldErrors) } }, { status: 400 });
    const supabase = createClient(await cookies());
    const { data: business, error } = await supabase.from(BUSINESSES_TABLE).update(result.business).eq("id", businessId).eq("user_id", DEMO_USER_ID).select("id").maybeSingle();
    if (error) return Response.json({ error: "Error updating business" }, { status: 500 });
    if (!business) return Response.json({ error: "Business not found" }, { status: 404 });
    try { await syncBusinessBanner(supabase, businessId, banner.banner); } catch (error) { console.error("Error updating business banner:", error); return Response.json({ error: "Unable to save business banner." }, { status: 502 }); }
    const { data: updated, error: refetchError } = await supabase.from(BUSINESSES_TABLE).select(BUSINESS_SELECT).eq("id", businessId).single();
    if (refetchError) return Response.json({ error: "Error fetching updated business" }, { status: 500 });
    return Response.json(mapBusinessProfileRowToDto(updated as BusinessProfileRow));
}

export async function DELETE(_request: Request, { params }: BusinessRouteContext) {
    const businessId = getBusinessId((await params).id);
    if (!businessId) return Response.json({ error: "Invalid business id" }, { status: 400 });
    const supabase = createClient(await cookies());
    const { data: business, error } = await supabase.from(BUSINESSES_TABLE).select("id,business_images(image_url)").eq("id", businessId).eq("user_id", DEMO_USER_ID).maybeSingle();
    if (error) return Response.json({ error: "Error deleting business" }, { status: 500 });
    if (!business) return Response.json({ error: "Business not found" }, { status: 404 });
    const { error: deleteError } = await supabase.from(BUSINESSES_TABLE).delete().eq("id", businessId);
    if (deleteError) return Response.json({ error: "Error deleting business" }, { status: 500 });
    const images = business.business_images as unknown as BusinessProfileRow["business_images"];
    await deleteImageUrlsFromR2(getBusinessImageUrls(images));
    return new Response(null, { status: 204 });
}
