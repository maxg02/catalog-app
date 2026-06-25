import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data: userBusinesses, error } = await supabase.from("UserBusinesses").select();
    console.log("userBusinesses", userBusinesses);

    if (error) {
        console.error("Error fetching user businesses:", error);
        return <div>Error fetching user businesses: {error.message}</div>;
    }

    return (
        <ul>
            <h1>PEpe</h1>
            {userBusinesses?.map((userBusiness) => (
                <li key={userBusiness.id}>{userBusiness.name}</li>
            ))}
        </ul>
    );
}
