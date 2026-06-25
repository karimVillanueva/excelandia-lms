import Link from "next/link";
import { directus } from "@/lib/directus";
import { readItem, readItems } from "@directus/sdk";
import { createLesson, createModule } from "./actions";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function CourseContentPage({
    params,
}: Props) {
    const { id } = await params;

    const course = await directus.request(
        readItem("courses", id, {
            fields: ["id", "title", "status"],
        })
    );

    const modules = await directus.request(
        readItems("course_modules", {
            filter: {
                course_id_: {
                    _eq: id,
                },
            },
            sort: ["sort", "title"],
            fields: ["id", "title", "description"],
        })
    );

    const lessons = await directus.request(
        readItems("course_lessons", {
            filter: {
                course_id_: {
                    _eq: id,
                },
            },
            sort: ["sort", "title"],
            fields: [
                "id",
                "title",
                "module_id.id",
                "status",
            ],
        })
    );

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-6xl px-6 py-10">
                <Link
                    href={`/admin/cursos/${id}`}
                    className="text-sm text-slate-400 hover:text-emerald-300"
                >
                    ← Volver al curso
                </Link>

                <header className="mt-6 mb-12">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Constructor de contenido
                    </p>

                    <h1 className="mt-4 text-5xl font-black">
                        {course.title}
                    </h1>
                </header>

                <div className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                    <h2 className="mb-5 text-xl font-bold">
                        Crear módulo
                    </h2>

                    <form
                        action={createModule.bind(null, id)}
                        className="flex flex-col gap-4 md:flex-row"
                    >
                        <input
                            name="title"
                            placeholder="Ej. Introducción"
                            className="flex-1 rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                        />

                        <button
                            type="submit"
                            className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 hover:bg-emerald-300"
                        >
                            Crear módulo
                        </button>
                    </form>
                </div>

                <div className="space-y-8">
                    {modules.length === 0 && (
                        <div className="rounded-3xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
                            Todavía no hay módulos.
                        </div>
                    )}

                    {modules.map((module) => {
                        const getRelationId = (value: any) =>
                            typeof value === "object" && value !== null
                                ? value.id
                                : value;

                        const moduleLessons = lessons.filter(
                            (lesson: any) =>
                                getRelationId(lesson.module_id) === module.id
                        );

                        return (
                            <div
                                key={module.id}
                                className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8"
                            >
                                <div className="mb-8">
                                    <h2 className="text-2xl font-black">
                                        {module.title}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {moduleLessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="rounded-2xl border border-slate-800 bg-[#02070F] p-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold">
                                                        {lesson.title}
                                                    </h3>

                                                    <p className="text-sm text-slate-500">
                                                        {lesson.status}
                                                    </p>
                                                </div>

                                                <Link
                                                    href={`/admin/lecciones/${lesson.id}`}
                                                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm hover:border-emerald-400"
                                                >
                                                    Editar
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <form
                                    action={createLesson.bind(
                                        null,
                                        id,
                                        module.id
                                    )}
                                    className="mt-6 flex flex-col gap-4 md:flex-row"
                                >
                                    <input
                                        name="title"
                                        placeholder="Nueva lección"
                                        className="flex-1 rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 outline-none focus:border-emerald-400"
                                    />

                                    <button
                                        type="submit"
                                        className="rounded-2xl bg-slate-800 px-6 py-3 font-bold hover:bg-slate-700"
                                    >
                                        Agregar lección
                                    </button>
                                </form>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}