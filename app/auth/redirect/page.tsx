import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
    const cookieStore = await cookies();

    const idToken = cookieStore.get("id_token")?.value;
    const accessToken = cookieStore.get("access_token")?.value;

    if (!idToken) {
        redirect("/");
    }

    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/me`, {
        headers: {
            Cookie: [
                `id_token=${idToken}`,
                accessToken ? `access_token=${accessToken}` : "",
            ]
                .filter(Boolean)
                .join("; "),
        },
        cache: "no-store",
    });

    if (!response.ok) {
        redirect("/dashboard");
    }

    const me = await response.json();
    const role = me.account?.role ?? "student";

    if (role === "admin") {
        redirect("/admin");
    }

    if (role === "instructor") {
        redirect("/instructor");
    }

    if (role === "support") {
        redirect("/support");
    }

    redirect("/dashboard");
}