import { directus } from "@/lib/directus";
import { readItem } from "@directus/sdk";
import HlsPlayer from "@/app/components/video/HlsPlayer";
import Link from "next/link";

interface Props {
    params: Promise<{
        courseId: string;
        lessonId: string;
    }>;
}

export default async function StudentLessonPage({ params }: Props) {
    const { courseId, lessonId } = await params;

    const lesson = await directus.request(
        readItem("course_lessons", lessonId, {
            fields: [
                "id",
                "title",
                "description",
                "video_status",
                "video_hls_path",
            ],
        })
    );

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-6xl px-6 py-10">
                <Link
                    href={`/cursos/${courseId}`}
                    className="text-sm text-slate-400 hover:text-emerald-300"
                >
                    ← Volver al curso
                </Link>

                <header className="my-8">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Lección
                    </p>

                    <h1 className="mt-4 text-4xl font-black md:text-5xl">
                        {lesson.title}
                    </h1>

                    {lesson.description && (
                        <p className="mt-3 max-w-3xl text-slate-400">
                            {lesson.description}
                        </p>
                    )}
                </header>

                {lesson.video_status === "ready" && lesson.video_hls_path ? (
                    <HlsPlayer
                        lessonId={lessonId}
                        courseId={courseId}
                        src={`/api/lessons/${lessonId}/hls`}
                    />
                ) : (
                    <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
                        Este video todavía no está disponible.
                    </div>
                )}
            </section>
        </main>
    );
}