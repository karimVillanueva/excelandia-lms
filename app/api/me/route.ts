import { NextRequest, NextResponse } from "next/server";
import { createItem, readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import { verifyToken } from "@/lib/cognito";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("id_token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    step: "cookie",
                    error: "No id_token cookie found",
                },
                { status: 401 }
            );
        }


        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(token);

        const email = payload.email as string;
        const cognitoSub = payload.sub as string;

        if (!email || !cognitoSub) {
            return NextResponse.json(
                { error: "Invalid token payload" },
                { status: 401 }
            );
        }

        let accounts = await directus.request(
            readItems("student_accounts", {
                filter: {
                    cognito_sub: {
                        _eq: cognitoSub,
                    },
                },
                limit: 1,
            })
        );

        let account = accounts[0];

        if (!account) {
            accounts = await directus.request(
                readItems("student_accounts", {
                    filter: {
                        email: {
                            _eq: email,
                        },
                    },
                    limit: 1,
                })
            );

            account = accounts[0];
        }

        if (!account) {
            account = await directus.request(
                createItem("student_accounts", {
                    email,
                    cognito_sub: cognitoSub,
                    status: "active",
                })
            );
        }

        const students = await directus.request(
            readItems("students", {
                filter: {
                    account_id: {
                        _eq: account.id,
                    },
                },
                limit: 1,
            })
        );

        const enrollments = await directus.request(
            readItems("student_enrollments", {
                filter: {
                    account_id: {
                        _eq: account.id,
                    },
                },
                fields: ["*", "course_id.*"],
            })
        );

        return NextResponse.json({
            authenticated: true,
            email,
            cognito_sub: cognitoSub,
            account,
            student: students[0] ?? null,
            enrollments,
        });
    } catch (error) {
        console.error("GET /api/me error:", error);

        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}