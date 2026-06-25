// app/auth/redirect/page.tsx

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AuthRedirectPage() {
    const accessToken = (await cookies()).get("access_token")?.value;

    if (!accessToken) {
        redirect("/");
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/me`,
        {
            headers: {
                Cookie: `access_token=${accessToken}`,
            },
            cache: "no-store",
        }
    );

    if (!response.ok) {
        redirect("/");
    }

    const me = await response.json();

    switch (me.account?.role) {
        case "admin":
            redirect("/admin");

        case "instructor":
            redirect("/instructor");

        case "support":
            redirect("/support");

        default:
            redirect("/dashboard");
    }
}