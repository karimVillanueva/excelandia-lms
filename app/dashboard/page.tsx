"use client";

import { useMe } from "@/hooks/useMe";

export default function DashboardPage() {
    const { me, loading } = useMe();

    if (loading) {
        return (
            <main className="min-h-screen bg-[#02070F] p-10 text-white">
                <p>Cargando...</p>
            </main>
        );
    }

    if (!me) {
        return (
            <main className="min-h-screen bg-[#02070F] p-10 text-white">
                <h1 className="text-2xl font-bold">No se pudo cargar tu cuenta</h1>
                <p className="mt-3 text-slate-400">
                    Intenta cerrar sesión e iniciar sesión nuevamente.
                </p>
            </main>
        );
    }

    const enrollments = me.enrollments ?? [];
    const displayName = me.student
        ? `${me.student.first_name} ${me.student.last_name}`
        : me.email;

    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-6xl px-6 py-10">
                <header className="mb-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
                        Excelandia LMS
                    </p>

                    <h1 className="mt-3 text-4xl font-bold">Bienvenido</h1>

                    <p className="mt-2 text-slate-400">{displayName}</p>
                </header>

                <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
                    <h2 className="text-lg font-semibold">Estado de la cuenta</h2>

                    <p className="mt-2 text-slate-300">
                        {me.account?.status ?? "Sin estado"}
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-bold">Mis cursos</h2>

                    {enrollments.length === 0 ? (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                            <p className="text-slate-300">
                                Todavía no tienes cursos activos.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {enrollments.map((enrollment) => (
                                <article
                                    key={enrollment.id}
                                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                                >
                                    <h3 className="text-lg font-semibold">
                                        {enrollment.course_id?.title ?? "Curso sin título"}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        Estado: {enrollment.status}
                                    </p>

                                    <p className="mt-2 text-sm text-slate-400">Vigencia:</p>

                                    <p className="text-sm text-slate-300">
                                        {enrollment.starts_at
                                            ? new Date(enrollment.starts_at).toLocaleDateString(
                                                "es-MX"
                                            )
                                            : "Sin fecha de inicio"}
                                    </p>

                                    <p className="text-sm text-slate-300">
                                        {enrollment.ends_at
                                            ? new Date(enrollment.ends_at).toLocaleDateString("es-MX")
                                            : "Sin fecha de fin"}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}