import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/cognito";

import {
    readItems
} from "@directus/sdk";

import { directus } from "@/lib/directus";

export async function GET(
    request: NextRequest
) {
    try {
        const token =
            request.cookies.get("id_token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const payload =
            await verifyToken(token);

        const email =
            payload.email as string;

        const sub =
            payload.sub as string;

        const accounts =
            await directus.request(
                readItems("student_accounts", {
                    filter: {
                        email: {
                            _eq: email,
                        },
                    },
                    limit: 1,
                })
            );

        if (!accounts.length) {
            return NextResponse.json(
                {
                    authenticated: true,
                    email,
                    sub,
                    account: null,
                }
            );
        }

        const account = accounts[0];

        const students =
            await directus.request(
                readItems("students", {
                    filter: {
                        account_id: {
                            _eq: account.id,
                        },
                    },
                    limit: 1,
                })
            );

        const enrollments =
            await directus.request(
                readItems(
                    "student_enrollments",
                    {
                        filter: {
                            account_id: {
                                _eq: account.id,
                            },
                        },
                        fields: [
                            "*",
                            "course_id.*",
                        ],
                    }
                )
            );

        return NextResponse.json({
            authenticated: true,
            email,
            sub,
            account,
            student:
                students[0] ?? null,
            enrollments,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                error: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }
}