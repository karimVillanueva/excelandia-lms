import { NextRequest, NextResponse } from "next/server";
import { createItem, readItems, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus";
import { verifyToken } from "@/lib/cognito";

interface Props {
    params: Promise<{ id: string }>;
}

async function getCurrentStudent(request: NextRequest) {
    const token = request.cookies.get("id_token")?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const payload = await verifyToken(token);
    const cognitoSub = payload.sub as string;
    const email = payload.email as string;

    const accounts = await directus.request(
        readItems("student_accounts", {
            filter: {
                _or: [
                    { cognito_sub: { _eq: cognitoSub } },
                    { email: { _eq: email } },
                ],
            },
            limit: 1,
        })
    );

    const account = accounts[0];

    if (!account) {
        throw new Error("Account not found");
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

    const student = students[0];

    if (!student) {
        throw new Error("Student not found");
    }

    return student;
}

export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id: lessonId } = await params;
        const student = await getCurrentStudent(request);

        const progress = await directus.request(
            readItems("Lesson_Progress", {
                filter: {
                    student_id: {
                        _eq: student.id,
                    },
                    lesson_id: {
                        _eq: lessonId,
                    },
                },
                limit: 1,
            })
        );

        return NextResponse.json({
            progress: progress[0] ?? null,
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error" },
            { status: 401 }
        );
    }
}

export async function POST(request: NextRequest, { params }: Props) {
    try {
        const { id: lessonId } = await params;
        const student = await getCurrentStudent(request);

        const body = await request.json();

        const lastPosition = Math.floor(Number(body.last_position ?? 0));
        const watchedSeconds = Math.floor(Number(body.watched_seconds ?? 0));
        const duration = Math.floor(Number(body.duration ?? 0));

        const watchPercent =
            duration > 0 ? Math.min(100, Math.round((lastPosition / duration) * 100)) : 0;

        const completed = watchPercent >= 90;

        const existing = await directus.request(
            readItems("Lesson_Progress", {
                filter: {
                    student_id: {
                        _eq: student.id,
                    },
                    lesson_id: {
                        _eq: lessonId,
                    },
                },
                limit: 1,
            })
        );

        const data = {
            student_id: student.id,
            lesson_id: lessonId,
            course_id: body.course_id ?? null,
            watched_seconds: watchedSeconds,
            last_position: lastPosition,
            watch_percent: watchPercent,
            completed,
            last_seen_at: new Date().toISOString(),
            ...(completed ? { completed_at: new Date().toISOString() } : {}),
            status: "published",
        };

        if (existing[0]) {
            await directus.request(updateItem("Lesson_Progress", existing[0].id, data));
        } else {
            await directus.request(
                createItem("Lesson_Progress", {
                    ...data,
                    first_viewed_at: new Date().toISOString(),
                })
            );
        }

        if (completed) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${courseId}/certificate`,
                    {
                        method: "POST",
                        headers: {
                            cookie: request.headers.get("cookie") ?? "",
                        },
                    }
                );

                if (!response.ok) {
                    console.error(
                        "No se pudo generar el certificado"
                    );
                }
            } catch (error) {
                console.error(
                    "Certificate generation error:",
                    error
                );
            }
        }

        return NextResponse.json({
            success: true,
            watch_percent: watchPercent,
            completed,
        });
    } catch (error) {
        console.error("Progress error:", error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error" },
            { status: 500 }
        );
    }
}