import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Link from "next/link";

export default async function AdminPage() {
    const courses = await directus.request(
        readItems("courses", {
            limit: 5,
            sort: ["-date_created"],
            fields: ["id", "title", "slug", "status", "date_created"],
        })
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />

            <section className="relative z-10 mx-auto max-w-7xl px-6 py-8">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                            Academia Excelandia
                        </p>
                        <h1 className="mt-4 text-4xl font-black md:text-5xl">
                            Panel administrativo
                        </h1>
                        <p className="mt-2 text-slate-400">
                            Gestiona cursos, contenido, instructores y alumnos.
                        </p>
                    </div>

                    <Link
                        href="/admin/cursos/nuevo"
                        className="rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                    >
                        Crear curso
                    </Link>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <Link
                        href="/admin/cursos"
                        className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60"
                    >
                        <p className="text-sm text-slate-400">Cursos</p>
                        <h2 className="mt-3 text-3xl font-black">{courses.length}</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Crear y editar cursos.
                        </p>
                    </Link>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                        <p className="text-sm text-slate-400">Videos</p>
                        <h2 className="mt-3 text-3xl font-black">0</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Procesamiento pendiente.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                        <p className="text-sm text-slate-400">Alumnos</p>
                        <h2 className="mt-3 text-3xl font-black">—</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Próximamente.
                        </p>
                    </div>
                </div>

                <section className="mt-12">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-3xl font-black">Cursos recientes</h2>
                        <Link
                            href="/admin/cursos"
                            className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                        >
                            Ver todos →
                        </Link>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur">
                        {courses.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                Todavía no hay cursos creados.
                            </div>
                        ) : (
                            courses.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/admin/cursos/${course.id}`}
                                    className="flex items-center justify-between border-b border-slate-800 px-6 py-5 transition last:border-b-0 hover:bg-slate-800/60"
                                >
                                    <div>
                                        <h3 className="font-bold">{course.title}</h3>
                                        <p className="text-sm text-slate-500">{course.slug}</p>
                                    </div>

                                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                                        {course.status}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </section>
        </main>
    );
}