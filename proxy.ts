import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/cursos", "/perfil"];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    const idToken = request.cookies.get("id_token");

    if (!idToken) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/cursos/:path*", "/perfil/:path*"],
};