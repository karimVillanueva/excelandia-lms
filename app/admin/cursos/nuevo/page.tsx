import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Link from "next/link";

export default async function AdminCoursesPage() {
    const courses = await directus.request(
        readItems("courses", {
            sort: ["sort", "title"],
            fields: [
                "id",
                "title",
                "slug",
                "status",
                "course_code",
                "date_created",
            ],
        })
    );

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-7xl px-6 py-8">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <Link
                            href="/admin"
                            className="text-sm text-slate-400 hover:text-emerald-300"
                        >
                            ← Volver al admin
                        </Link>

                        <h1 className="mt-4 text-4xl font-black">Cursos</h1>
                        <p className="mt-2 text-slate-400">
                            Administra los cursos de Academia Excelandia.
                        </p>
                    </div>

                    <Link
                        href="/admin/cursos/nuevo"
                        className="rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                    >
                        Nuevo curso
                    </Link>
                </header>

                <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50">
                    <div className="grid grid-cols-12 border-b border-slate-800 px-6 py-4 text-sm font-bold text-slate-400">
                        <div className="col-span-5">Curso</div>
                        <div className="col-span-2">Código</div>
                        <div className="col-span-2">Estado</div>
                        <div className="col-span-3 text-right">Acciones</div>
                    </div>

                    {courses.length === 0 ? (
                        <div className="p-10 text-center text-slate-400">
                            No hay cursos registrados.
                        </div>
                    ) : (
                        courses.map((course) => (
                            <div
                                key={course.id}
                                className="grid grid-cols-12 items-center border-b border-slate-800 px-6 py-5 last:border-b-0"
                            >
                                <div className="col-span-5">
                                    <h2 className="font-bold">{course.title}</h2>
                                    <p className="text-sm text-slate-500">{course.slug}</p>
                                </div>

                                <div className="col-span-2 text-sm text-slate-400">
                                    {course.course_code ?? "—"}
                                </div>

                                <div className="col-span-2">
                                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                                        {course.status}
                                    </span>
                                </div>

                                <div className="col-span-3 flex justify-end gap-3">
                                    <Link
                                        href={`/admin/cursos/${course.id}`}
                                        className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-emerald-400 hover:text-white"
                                    >
                                        Editar
                                    </Link>

                                    <Link
                                        href={`/admin/cursos/${course.id}/contenido`}
                                        className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold transition hover:bg-slate-700"
                                    >
                                        Contenido
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}