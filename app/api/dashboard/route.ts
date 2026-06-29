import { NextRequest, NextResponse } from "next/server";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import { verifyToken } from "@/lib/cognito";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("id_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = await verifyToken(token);
        const email = payload.email as string;
        const cognitoSub = payload.sub as string;

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
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
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

        const student = students[0] ?? null;

        const enrollments = await directus.request(
            readItems("student_enrollments", {
                filter: {
                    account_id: {
                        _eq: account.id,
                    },
                },
                fields: [
                    "id",
                    "status",
                    "starts_at",
                    "ends_at",
                    "course_id.id",
                    "course_id.title",
                    "course_id.slug",
                    "course_id.description",
                    "course_id.thumbnail.id",
                    "course_id.thumbnail.filename_download",
                ],
            })
        );

        const courseIds = enrollments
            .map((enrollment: any) => enrollment.course_id?.id)
            .filter(Boolean);

        const lessons =
            courseIds.length > 0
                ? await directus.request(
                    readItems("course_lessons", {
                        filter: {
                            course_id: {
                                _in: courseIds,
                            },
                            status: {
                                _eq: "published",
                            },
                        },
                        fields: ["id", "title", "course_id", "sort"],
                        sort: ["sort", "title"],
                        limit: -1,
                    })
                )
                : [];

        const progress =
            student && lessons.length > 0
                ? await directus.request(
                    readItems("Lesson_Progress", {
                        filter: {
                            student_id: {
                                _eq: student.id,
                            },
                            lesson_id: {
                                _in: lessons.map((lesson: any) => lesson.id),
                            },
                        },
                        fields: [
                            "id",
                            "lesson_id",
                            "course_id",
                            "last_position",
                            "watch_percent",
                            "completed",
                            "last_seen_at",
                        ],
                        limit: -1,
                    })
                )
                : [];

        const progressByLesson = new Map(
            progress.map((item: any) => [
                typeof item.lesson_id === "object" ? item.lesson_id.id : item.lesson_id,
                item,
            ])
        );

        const dashboardCourses = enrollments.map((enrollment: any) => {
            const course = enrollment.course_id;
            const courseLessons = lessons.filter((lesson: any) => {
                const lessonCourseId =
                    typeof lesson.course_id === "object"
                        ? lesson.course_id.id
                        : lesson.course_id;

                return lessonCourseId === course?.id;
            });

            const completedCount = courseLessons.filter((lesson: any) => {
                const lessonProgress = progressByLesson.get(lesson.id);
                return lessonProgress?.completed === true;
            }).length;

            const progressPercent =
                courseLessons.length > 0
                    ? Math.round((completedCount / courseLessons.length) * 100)
                    : 0;

            const lastProgress = progress
                .filter((item: any) => {
                    const itemCourseId =
                        typeof item.course_id === "object" ? item.course_id.id : item.course_id;

                    return itemCourseId === course?.id;
                })
                .sort((a: any, b: any) => {
                    return (
                        new Date(b.last_seen_at ?? 0).getTime() -
                        new Date(a.last_seen_at ?? 0).getTime()
                    );
                })[0];

            const lastLessonId =
                typeof lastProgress?.lesson_id === "object"
                    ? lastProgress.lesson_id.id
                    : lastProgress?.lesson_id;

            const firstLesson = courseLessons[0];

            const continueLessonId = lastLessonId ?? firstLesson?.id ?? null;

            return {
                enrollment,
                course,
                totalLessons: courseLessons.length,
                completedLessons: completedCount,
                progressPercent,
                continueUrl: continueLessonId
                    ? `/cursos/${course.id}/lecciones/${continueLessonId}`
                    : null,
            };
        });

        return NextResponse.json({
            authenticated: true,
            account,
            student,
            courses: dashboardCourses,
        });
    } catch (error) {
        console.error("GET /api/dashboard error:", error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Error",
            },
            { status: 500 }
        );
    }
}