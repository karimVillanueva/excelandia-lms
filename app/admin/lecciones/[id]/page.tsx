import Link from "next/link";
import { directus } from "@/lib/directus";
import { readItem } from "@directus/sdk";
import { updateLesson } from "./actions";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function LessonPage({
    params,
}: Props) {
    const { id } = await params;

    const lesson = await directus.request(
        readItem("course_lessons", id, {
            fields: [
                "id",
                "title",
                "description",
                "status",
                "is_preview",
                "video_status",
                "video_hls_path",
            ],
        })
    );

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-5xl px-6 py-10">
                <Link
                    href="javascript:history.back()"
                    className="text-sm text-slate-400 hover:text-emerald-300"
                >
                    ← Volver
                </Link>

                <header className="mt-6 mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Lección
                    </p>

                    <h1 className="mt-4 text-5xl font-black">
                        {lesson.title}
                    </h1>
                </header>

                <form
                    action={updateLesson.bind(null, id)}
                    className="space-y-8"
                >
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                        <h2 className="mb-6 text-2xl font-black">
                            Información
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Título
                                </label>

                                <input
                                    name="title"
                                    defaultValue={lesson.title}
                                    className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Descripción
                                </label>

                                <textarea
                                    name="description"
                                    rows={6}
                                    defaultValue={lesson.description ?? ""}
                                    className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-300">
                                    Estado
                                </label>

                                <select
                                    name="status"
                                    defaultValue={lesson.status}
                                    className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                                >
                                    <option value="draft">
                                        Borrador
                                    </option>

                                    <option value="published">
                                        Publicado
                                    </option>

                                    <option value="archived">
                                        Archivado
                                    </option>
                                </select>
                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="is_preview"
                                    defaultChecked={
                                        lesson.is_preview
                                    }
                                    className="h-5 w-5"
                                />

                                <span>
                                    Permitir vista previa gratuita
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                        <h2 className="mb-6 text-2xl font-black">
                            Video
                        </h2>

                        <p className="text-slate-400">
                            Estado:
                            <span className="ml-2 rounded-full bg-slate-800 px-3 py-1 text-sm">
                                {lesson.video_status}
                            </span>
                        </p>

                        {!lesson.video_hls_path ? (
                            <p className="mt-4 text-slate-500">
                                No se ha cargado ningún video.
                            </p>
                        ) : (
                            <p className="mt-4 text-emerald-400">
                                Video disponible.
                            </p>
                        )}
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                        <h2 className="mb-6 text-2xl font-black">
                            Materiales
                        </h2>

                        <p className="text-slate-500">
                            Próximamente podrás subir PDFs,
                            Excel, ZIP y archivos de apoyo.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="rounded-2xl bg-emerald-400 px-8 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                    >
                        Guardar cambios
                    </button>
                </form>
            </section>
        </main>
    );
}