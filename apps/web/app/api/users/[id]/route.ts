import * as bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { mapUserRowToDto } from "@/lib/mappers/userBusinessMapper";
import { createClient } from "@/utils/supabase/server";
import type { UserRow } from "@/interfaces";

const USERS_TABLE = "users";
const USER_SELECT = "id,name,email,role";
const PASSWORD_SALT_ROUNDS = 10;

type UserRouteContext = {
    params: Promise<{ id: string }>;
};

type UserBody = {
    name?: unknown;
    email?: unknown;
    password?: unknown;
};

function text(value: unknown) {
    return typeof value === "string" ? value.trim() : "";
}

function getUserId(id: string) {
    const userId = Number(id);

    return Number.isInteger(userId) && userId > 0 ? userId : null;
}

async function parseUserBody(request: Request) {
    try {
        return (await request.json()) as UserBody;
    } catch {
        return null;
    }
}

export async function PUT(request: Request, { params }: UserRouteContext) {
    const { id } = await params;
    const userId = getUserId(id);

    if (!userId) {
        return Response.json({ error: "Invalid user id" }, { status: 400 });
    }

    const body = await parseUserBody(request);

    if (!body) {
        return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    const name = text(body.name);
    const email = text(body.email);
    const password = text(body.password);
    const fieldErrors: Record<string, string> = {};

    if (!name) fieldErrors.name = "Name is required.";
    if (!email || !email.includes("@")) fieldErrors.email = "Valid email is required.";
    if (body.password != null && typeof body.password !== "string") {
        fieldErrors.password = "Password is invalid.";
    }

    if (Object.keys(fieldErrors).length > 0) {
        return Response.json(
            { error: "Please fix the highlighted fields.", fieldErrors },
            { status: 400 },
        );
    }

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const update: Record<string, string> = { name, email };

    if (password) update.password = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

    const { data: user, error } = await supabase
        .from(USERS_TABLE)
        .update(update)
        .eq("id", userId)
        .select(USER_SELECT)
        .maybeSingle();

    if (error) {
        console.error("Error updating user:", error);

        return Response.json({ error: "Error updating user" }, { status: 500 });
    }

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(mapUserRowToDto(user as UserRow));
}
