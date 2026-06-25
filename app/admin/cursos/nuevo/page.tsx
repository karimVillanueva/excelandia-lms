// app/admin/cursos/nuevo/page.tsx

import Link from "next/link";
import { createCourse } from "./actions";

export default function NewCoursePage() {
    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />

            <section className="relative z-10 mx-auto max-w-4xl px-6 py-10">
                <Link
                    href="/admin/cursos"
                    className="text-sm font-semibold text-slate-400 transition hover:text-emerald-300"
                >
                    ← Volver a cursos
                </Link>

                <header className="mt-8 mb-10">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Academia Excelandia
                    </p>

                    <h1 className="mt-4 text-4xl font-black md:text-5xl">
                        Crear nuevo curso
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Define la información base del curso. Después podrás agregar módulos,
                        lecciones, videos y materiales.
                    </p>
                </header>

                <form
                    action={createCourse}
                    className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-[0_0_60px_rgba(16,185,129,0.08)] backdrop-blur"
                >
                    <div className="grid gap-6">
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-300">
                                Título del curso *
                            </label>
                            <input
                                name="title"
                                required
                                placeholder="Ej. Excel desde cero"
                                className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-300">
                                Slug
                            </label>
                            <input
                                name="slug"
                                placeholder="excel-desde-cero"
                                className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                            />
                            <p className="mt-2 text-xs text-slate-500">
                                Si lo dejas vacío, se generará automáticamente desde el título.
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-slate-300">
                                Código del curso
                            </label>
                            <input
                                name="course_code"
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
                                rows={5}
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
                                defaultValue="draft"
                                className="w-full rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                            >
                                <option value="draft">Borrador</option>
                                <option value="published">Publicado</option>
                                <option value="archived">Archivado</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-end">
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
                            Crear curso y continuar →
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}