import { cookies } from "next/headers";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: businesses, error } = await supabase.from("businesses").select();

    if (error) {
        console.error("Error fetching businesses:", error);
        return <div>Error fetching businesses: {error.message}</div>;
    }

    return (
        <ul>
            <h1>Businesses</h1>
            {businesses?.map((business) => (
                <li key={business.id}>
                    <Link href={`/catalog/${business.id}`}>{business.name}</Link>
                </li>
            ))}
        </ul>
    );
}
