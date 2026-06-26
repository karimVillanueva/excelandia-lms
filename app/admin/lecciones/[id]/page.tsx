import Link from "next/link";
import { directus } from "@/lib/directus";
import { readItem, readItems } from "@directus/sdk";
import {
    deleteLessonMaterial,
    updateLesson,
    uploadLessonMaterial,
} from "./actions";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function LessonPage({ params }: Props) {
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
                "course_id",
            ],
        })
    );

    const materials = await directus.request(
        readItems("lesson_materials", {
            filter: {
                lesson_id: {
                    _eq: id,
                },
            },
            sort: ["sort", "title"],
            fields: [
                "id",
                "title",
                "description",
                "file_type",
                "is_downloadable",
                "file.id",
                "file.filename_download",
                "file.filesize",
                "file.type",
            ],
        })
    );

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-5xl px-6 py-10">
                <Link
                    href="/admin/cursos"
                    className="text-sm text-slate-400 hover:text-emerald-300"
                >
                    ← Volver a cursos
                </Link>

                <header className="mt-6 mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Lección
                    </p>

                    <h1 className="mt-4 text-5xl font-black">{lesson.title}</h1>
                </header>

                <form action={updateLesson.bind(null, id)} className="space-y-8">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                        <h2 className="mb-6 text-2xl font-black">Información</h2>

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
                                    <option value="draft">Borrador</option>
                                    <option value="published">Publicado</option>
                                    <option value="archived">Archivado</option>
                                </select>
                            </div>

                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="is_preview"
                                    defaultChecked={lesson.is_preview}
                                    className="h-5 w-5"
                                />

                                <span>Permitir vista previa gratuita</span>
                            </label>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                        <h2 className="mb-6 text-2xl font-black">Video</h2>

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
                            <p className="mt-4 text-emerald-400">Video disponible.</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="rounded-2xl bg-emerald-400 px-8 py-4 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                    >
                        Guardar cambios
                    </button>
                </form>

                <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
                    <h2 className="mb-6 text-2xl font-black">Materiales</h2>

                    <form
                        action={uploadLessonMaterial.bind(null, id, lesson.course_id)}
                        className="mb-8 grid gap-4"
                    >
                        <input
                            name="title"
                            placeholder="Nombre del material"
                            className="rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                        />

                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Descripción breve del material"
                            className="resize-none rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                        />

                        <select
                            name="file_type"
                            defaultValue="pdf"
                            className="rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                        >
                            <option value="pdf">PDF</option>
                            <option value="xlsx">Excel</option>
                            <option value="zip">ZIP</option>
                            <option value="image">Imagen</option>
                            <option value="other">Otro</option>
                        </select>

                        <input
                            type="file"
                            name="file"
                            required
                            className="rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-slate-300"
                        />

                        <label className="flex items-center gap-3 text-slate-300">
                            <input
                                type="checkbox"
                                name="is_downloadable"
                                defaultChecked
                                className="h-5 w-5"
                            />
                            Permitir descarga
                        </label>

                        <button
                            type="submit"
                            className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                        >
                            Subir material
                        </button>
                    </form>

                    {materials.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 p-6 text-center text-slate-500">
                            No hay materiales cargados.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {materials.map((material: any) => (
                                <div
                                    key={material.id}
                                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#02070F] p-4"
                                >
                                    <div>
                                        <h3 className="font-bold">{material.title}</h3>

                                        <p className="text-sm text-slate-500">
                                            {material.file_type} ·{" "}
                                            {material.file?.filename_download ?? "Archivo"}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        {material.file?.id && (
                                            <a
                                                href={`${process.env.DIRECTUS_URL}/assets/${material.file.id}?download`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:border-emerald-400"
                                            >
                                                Ver
                                            </a>
                                        )}

                                        <form
                                            action={deleteLessonMaterial.bind(null, id, material.id)}
                                        >
                                            <button
                                                type="submit"
                                                className="rounded-xl border border-red-500/40 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10"
                                            >
                                                Eliminar
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}