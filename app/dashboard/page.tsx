"use client";

import { useMe } from "@/hooks/useMe";

export default function DashboardPage() {
    const { me, loading } = useMe();

    async function logout() {
        const response = await fetch("/api/logout", {
            method: "POST",
        });

        const data = await response.json();
        window.location.href = data.logoutUrl;
    }

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] text-white">
                <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 px-8 py-6">
                    Cargando tu academia...
                </div>
            </main>
        );
    }

    if (!me) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] text-white">
                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <h1 className="text-2xl font-bold">No se pudo cargar tu cuenta</h1>
                    <p className="mt-3 text-slate-300">
                        Cierra sesión e intenta entrar nuevamente.
                    </p>
                </div>
            </main>
        );
    }

    const enrollments = me.enrollments ?? [];
    const displayName = me.student
        ? `${me.student.first_name} ${me.student.last_name}`
        : me.email;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />
            <div className="absolute right-20 top-28 h-40 w-40 animate-pulse rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-20 left-20 h-48 w-48 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />

            <section className="relative z-10 mx-auto max-w-7xl px-6 py-8">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <p className="logo-font text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                            Academia Excelandia
                        </p>
                        <h1 className="mt-4 text-4xl font-black md:text-5xl">
                            Hola, {displayName}
                        </h1>
                        <p className="mt-2 text-slate-400">
                            Este es tu espacio de aprendizaje.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-300 backdrop-blur transition hover:-translate-y-0.5 hover:border-emerald-400 hover:text-white"
                    >
                        Cerrar sesión
                    </button>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60">
                        <p className="text-sm text-slate-400">Estado de cuenta</p>
                        <h2 className="mt-3 text-2xl font-bold text-emerald-300">
                            {me.account?.status ?? "Sin estado"}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60">
                        <p className="text-sm text-slate-400">Cursos activos</p>
                        <h2 className="mt-3 text-2xl font-bold">
                            {enrollments.length}
                        </h2>
                    </div>

                    <a
                        href="/soporte"
                        className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60"
                    >
                        <p className="text-sm text-slate-400">¿Necesitas ayuda?</p>
                        <h2 className="mt-3 text-2xl font-bold">Centro de ayuda →</h2>
                    </a>
                </div>

                <section className="mt-12">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-3xl font-black">Mis cursos</h2>
                        <a
                            href="https://www.excelandia.com/tienda"
                            className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                        >
                            Ir a la tienda →
                        </a>
                    </div>

                    {enrollments.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center backdrop-blur">
                            <p className="text-xl font-bold">
                                Todavía no tienes cursos activos
                            </p>
                            <p className="mx-auto mt-3 max-w-xl text-slate-400">
                                Cuando compres un material o se active tu inscripción, aparecerá
                                aquí automáticamente.
                            </p>

                            <a
                                href="https://www.excelandia.com/tienda"
                                className="mt-6 inline-block rounded-2xl bg-emerald-400 px-7 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                            >
                                Explorar tienda
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-3">
                            {enrollments.map((enrollment) => (
                                <article
                                    key={enrollment.id}
                                    className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition hover:-translate-y-2 hover:border-emerald-400/70 hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]"
                                >
                                    <div className="mb-5 h-32 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 transition group-hover:scale-[1.02]" />

                                    <h3 className="text-xl font-bold">
                                        {enrollment.course_id?.title ?? "Curso sin título"}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        Estado: {enrollment.status}
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Vigencia:
                                    </p>

                                    <p className="text-sm text-slate-300">
                                        {enrollment.starts_at
                                            ? new Date(enrollment.starts_at).toLocaleDateString(
                                                "es-MX"
                                            )
                                            : "Sin fecha de inicio"}{" "}
                                        —{" "}
                                        {enrollment.ends_at
                                            ? new Date(enrollment.ends_at).toLocaleDateString(
                                                "es-MX"
                                            )
                                            : "Sin fecha de fin"}
                                    </p>

                                    <button className="mt-6 w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300">
                                        Entrar al curso
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}