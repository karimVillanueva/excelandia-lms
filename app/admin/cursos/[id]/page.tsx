import Link from "next/link";
import { directus } from "@/lib/directus";
import { readItem } from "@directus/sdk";
import { updateCourse } from "./actions";
import AdminHeader from "@/app/components/admin/AdminHeader";


interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditCoursePage({ params }: Props) {
    const { id } = await params;

    const course = await directus.request(
        readItem("courses", id, {
            fields: [
                "id",
                "title",
                "slug",
                "description",
                "status",
                "course_code",
                "thumbnail.id",
                "thumbnail.filename_download",
            ],
        })
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />
            <AdminHeader
                title="Editar curso"
                description="Actualiza la información general y configuración del curso."
                backHref="/admin"
                backLabel="Panel administrativo"
            />

            <section className="relative z-10 mx-auto max-w-5xl px-6 py-10">
                <div className="flex items-center justify-between gap-4">
                    <Link
                        href="/admin/cursos"
                        className="text-sm font-semibold text-slate-400 transition hover:text-emerald-300"
                    >
                        ← Volver a cursos
                    </Link>

                    <Link
                        href={`/admin/cursos/${id}/contenido`}
                        className="rounded-2xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-bold text-slate-200 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:text-white"
                    >
                        Ir a contenido →
                    </Link>
                </div>

                <header className="mt-8 mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Editar curso
                    </p>

                    <h1 className="mt-4 text-4xl font-black md:text-5xl">
                        {course.title}
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Modifica la información general del curso. El contenido se gestiona
                        desde el constructor de módulos y lecciones.
                    </p>
                </header>

                <form
                    action={updateCourse.bind(null, id)}
                    className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur"
                >
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Título del curso *
                        </label>

                        <input
                            name="title"
                            required
                            defaultValue={course.title}
                            className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Slug
                        </label>

                        <input
                            name="slug"
                            defaultValue={course.slug ?? ""}
                            placeholder="excel-desde-cero"
                            className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Se usará para construir URLs amigables del curso.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Código del curso
                        </label>

                        <input
                            name="course_code"
                            defaultValue={course.course_code ?? ""}
                            placeholder="EXCEL-001"
                            className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Descripción
                        </label>

                        <textarea
                            name="description"
                            rows={6}
                            defaultValue={course.description ?? ""}
                            placeholder="Describe qué aprenderá el alumno en este curso."
                            className="w-full resize-none rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Estado
                        </label>

                        <select
                            name="status"
                            defaultValue={course.status ?? "draft"}
                            className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                        >
                            <option value="draft">Borrador</option>
                            <option value="published">Publicado</option>
                            <option value="archived">Archivado</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-300">
                            Miniatura
                        </label>

                        {course.thumbnail?.id ? (
                            <div className="mb-4 rounded-2xl border border-slate-800 bg-[#02070F] p-4 text-sm text-slate-400">
                                Miniatura actual:{" "}
                                <span className="text-slate-200">
                                    {course.thumbnail.filename_download}
                                </span>
                            </div>
                        ) : (
                            <div className="mb-4 rounded-2xl border border-dashed border-slate-700 bg-[#02070F] p-4 text-sm text-slate-500">
                                Este curso todavía no tiene miniatura.
                            </div>
                        )}

                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-slate-300"
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Sube una imagen horizontal para mostrar el curso en el dashboard y
                            la tienda.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
                        <Link
                            href="/admin/cursos"
                            className="rounded-2xl border border-slate-700 px-6 py-3 text-center font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
                        >
                            Cancelar
                        </Link>

                        <button
                            type="submit"
                            className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.25)] transition hover:-translate-y-1 hover:bg-emerald-300"
                        >
                            Guardar cambios
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}