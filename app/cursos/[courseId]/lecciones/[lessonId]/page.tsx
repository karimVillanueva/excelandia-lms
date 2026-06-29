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

async function getNavigation(lessonId: string) {
    const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ??
        process.env.VERCEL_URL ??
        "http://localhost:3000";

    const url = baseUrl.startsWith("http")
        ? `${baseUrl}/api/lessons/${lessonId}/navigation`
        : `https://${baseUrl}/api/lessons/${lessonId}/navigation`;

    const response = await fetch(url, {
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
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

    const navigation = await getNavigation(lessonId);

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_380px]">
                <div>
                    <Link
                        href="/dashboard"
                        className="text-sm text-slate-400 hover:text-emerald-300"
                    >
                        ← Volver al dashboard
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

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        {navigation?.previousLesson ? (
                            <Link
                                href={navigation.previousLesson.href}
                                className="rounded-2xl border border-slate-700 px-6 py-3 text-center font-bold text-slate-300 transition hover:border-emerald-400 hover:text-white"
                            >
                                ← Anterior
                            </Link>
                        ) : (
                            <div />
                        )}

                        {navigation?.nextLesson ? (
                            <Link
                                href={navigation.nextLesson.href}
                                className="rounded-2xl bg-emerald-400 px-6 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                            >
                                Siguiente →
                            </Link>
                        ) : (
                            <Link
                                href="/dashboard"
                                className="rounded-2xl bg-slate-800 px-6 py-3 text-center font-bold text-slate-300 transition hover:bg-slate-700"
                            >
                                Finalizar y volver al dashboard
                            </Link>
                        )}
                    </div>
                </div>

                <aside className="h-fit rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur lg:sticky lg:top-8">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
                        Contenido
                    </p>

                    <h2 className="mt-3 text-2xl font-black">
                        {navigation?.course?.title ?? "Curso"}
                    </h2>

                    <div className="mt-6 space-y-6">
                        {navigation?.modules?.map((module: any) => (
                            <div key={module.id}>
                                <h3 className="mb-3 text-sm font-bold text-slate-300">
                                    {module.title}
                                </h3>

                                <div className="space-y-2">
                                    {module.lessons.map((item: any) =>
                                        item.isLocked ? (
                                            <div
                                                key={item.id}
                                                className="block rounded-2xl border border-slate-800 bg-[#02070F]/80 px-4 py-3 text-sm text-slate-500 opacity-70"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span>🔒</span>

                                                    <div>
                                                        <p className="font-semibold">{item.title}</p>

                                                        <p className="mt-1 text-xs">
                                                            Completa la lección anterior
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                className={`block rounded-2xl border px-4 py-3 text-sm transition ${item.isCurrent
                                                        ? "border-emerald-400/70 bg-emerald-400/10 text-emerald-200"
                                                        : "border-slate-800 bg-[#02070F]/80 text-slate-400 hover:border-slate-600 hover:text-white"
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <span className="mt-0.5">
                                                        {item.completed ? "✅" : item.isCurrent ? "▶" : "○"}
                                                    </span>

                                                    <div>
                                                        <p className="font-semibold">{item.title}</p>

                                                        {item.watchPercent > 0 && !item.completed && (
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {item.watchPercent}% visto
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
            </section>
        </main>
    );
}