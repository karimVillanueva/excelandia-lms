import { NextResponse } from "next/server";

export async function POST() {
    const logoutUrl =
        `${process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI}/logout?` +
        new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!,
            logout_uri: process.env.NEXT_PUBLIC_COGNITO_LOGOUT_URI!,
        }).toString();

    const response = NextResponse.json({
        success: true,
        logoutUrl,
    });

    response.cookies.set("id_token", "", {
        path: "/",
        expires: new Date(0),
    });

    response.cookies.set("access_token", "", {
        path: "/",
        expires: new Date(0),
    });

    return response;
}