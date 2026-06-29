import { NextRequest, NextResponse } from "next/server";
import { readItem, readItems } from "@directus/sdk";
import { directus } from "@/lib/directus";
import { verifyToken } from "@/lib/cognito";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

async function getCurrentStudent(request: NextRequest) {
    const token = request.cookies.get("id_token")?.value;

    if (!token) {
        return null;
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
        return null;
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

    return students[0] ?? null;
}

function getRelationId(value: any) {
    return typeof value === "object" && value !== null ? value.id : value;
}

export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id: lessonId } = await params;

        const currentLesson: any = await directus.request(
            readItem("course_lessons", lessonId, {
                fields: [
                    "id",
                    "title",
                    "description",
                    "status",
                    "course_id",
                    "module_id.id",
                    "sort",
                ],
            })
        );

        const courseId = getRelationId(currentLesson.course_id);

        const course: any = await directus.request(
            readItem("courses", courseId, {
                fields: ["id", "title", "slug", "description"],
            })
        );

        const modules: any[] = await directus.request(
            readItems("course_modules", {
                filter: {
                    course_id_: {
                        _eq: courseId,
                    },
                },
                fields: ["id", "title", "description", "sort"],
                sort: ["sort", "title"],
                limit: -1,
            })
        );

        const lessons: any[] = await directus.request(
            readItems("course_lessons", {
                filter: {
                    course_id: {
                        _eq: courseId,
                    },
                    status: {
                        _eq: "published",
                    },
                },
                fields: [
                    "id",
                    "title",
                    "description",
                    "status",
                    "course_id",
                    "module_id.id",
                    "sort",
                ],
                sort: ["sort", "title"],
                limit: -1,
            })
        );

        const student = await getCurrentStudent(request);

        const progress =
            student && lessons.length > 0
                ? await directus.request(
                    readItems("Lesson_Progress", {
                        filter: {
                            student_id: {
                                _eq: student.id,
                            },
                            lesson_id: {
                                _in: lessons.map((lesson) => lesson.id),
                            },
                        },
                        fields: [
                            "id",
                            "lesson_id",
                            "watch_percent",
                            "completed",
                            "last_position",
                            "last_seen_at",
                        ],
                        limit: -1,
                    })
                )
                : [];

        const progressByLesson = new Map(
            progress.map((item: any) => [getRelationId(item.lesson_id), item])
        );

        const orderedLessons = [...lessons].sort((a: any, b: any) => {
            const moduleA = modules.findIndex(
                (module) => module.id === getRelationId(a.module_id)
            );
            const moduleB = modules.findIndex(
                (module) => module.id === getRelationId(b.module_id)
            );

            if (moduleA !== moduleB) {
                return moduleA - moduleB;
            }

            return Number(a.sort ?? 0) - Number(b.sort ?? 0);
        });

        const currentIndex = orderedLessons.findIndex(
            (lesson) => lesson.id === lessonId
        );

        const previousLesson =
            currentIndex > 0 ? orderedLessons[currentIndex - 1] : null;

        const nextLesson =
            currentIndex >= 0 && currentIndex < orderedLessons.length - 1
                ? orderedLessons[currentIndex + 1]
                : null;

        const modulesWithLessons = modules.map((module) => {
            const moduleLessons = orderedLessons
                .filter((lesson) => getRelationId(lesson.module_id) === module.id)
                .map((lesson) => {
                    const lessonProgress = progressByLesson.get(lesson.id);

                    return {
                        id: lesson.id,
                        title: lesson.title,
                        status: lesson.status,
                        isCurrent: lesson.id === lessonId,
                        completed: lessonProgress?.completed === true,
                        watchPercent: lessonProgress?.watch_percent ?? 0,
                        href: `/cursos/${courseId}/lecciones/${lesson.id}`,
                    };
                });

            return {
                id: module.id,
                title: module.title,
                description: module.description,
                lessons: moduleLessons,
            };
        });

        return NextResponse.json({
            course,
            currentLesson,
            previousLesson: previousLesson
                ? {
                    id: previousLesson.id,
                    title: previousLesson.title,
                    href: `/cursos/${courseId}/lecciones/${previousLesson.id}`,
                }
                : null,
            nextLesson: nextLesson
                ? {
                    id: nextLesson.id,
                    title: nextLesson.title,
                    href: `/cursos/${courseId}/lecciones/${nextLesson.id}`,
                }
                : null,
            modules: modulesWithLessons,
        });
    } catch (error) {
        console.error("Navigation error:", error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Error",
            },
            { status: 500 }
        );
    }
}