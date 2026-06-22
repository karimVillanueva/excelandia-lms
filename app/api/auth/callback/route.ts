// app/api/auth/callback/route.ts

import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { code } = await request.json();

        if (!code) {
            return NextResponse.json(
                { error: "Authorization code is required" },
                { status: 400 }
            );
        }

        const tokenEndpoint = `${process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI}/oauth2/token`;

        const body = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.NEXT_PUBLIC_OIDC_CLIENT_ID!,
            code,
            redirect_uri: process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI!,
        });

        const response = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Cognito token error:", errorText);

            return NextResponse.json(
                { error: "Could not exchange authorization code" },
                { status: 401 }
            );
        }

        const tokens = await response.json();

        const res = NextResponse.json({ success: true });

        res.cookies.set("id_token", tokens.id_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: tokens.expires_in,
        });

        res.cookies.set("access_token", tokens.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
            maxAge: tokens.expires_in,
        });

        return res;
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Unexpected auth error" },
            { status: 500 }
        );
    }
}