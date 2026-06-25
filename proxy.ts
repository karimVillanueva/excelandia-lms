import { NextRequest, NextResponse } from "next/server";

type Role = "student" | "admin" | "instructor" | "support";

const protectedRoutes = [
    "/dashboard",
    "/cursos",
    "/perfil",
    "/admin",
    "/instructor",
    "/support",
];

function isProtectedPath(pathname: string) {
    return protectedRoutes.some((route) => pathname.startsWith(route));
}

async function getMe(request: NextRequest) {
    const idToken = request.cookies.get("id_token")?.value;
    const accessToken = request.cookies.get("access_token")?.value;

    if (!idToken) return null;

    const response = await fetch(`${request.nextUrl.origin}/api/me`, {
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

    if (!response.ok) return null;

    return response.json();
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (!isProtectedPath(pathname)) {
        return NextResponse.next();
    }

    const me = await getMe(request);

    if (!me?.authenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const role = (me.account?.role ?? "student") as Role;

    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
        pathname.startsWith("/instructor") &&
        role !== "admin" &&
        role !== "instructor"
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (
        pathname.startsWith("/support") &&
        role !== "admin" &&
        role !== "support"
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/cursos/:path*",
        "/perfil/:path*",
        "/admin/:path*",
        "/instructor/:path*",
        "/support/:path*",
    ],
};