"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function logout() {
        const response = await fetch("/api/logout", {
            method: "POST",
        });

        const data = await response.json();
        window.location.href = data.logoutUrl;
    }

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await fetch("/api/dashboard");

                if (!response.ok) {
                    setDashboard(null);
                    return;
                }

                const data = await response.json();
                setDashboard(data);
            } catch (error) {
                console.error(error);
                setDashboard(null);
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-6 text-white">
                <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 px-8 py-6">
                    Cargando tu academia...
                </div>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-6 text-white">
                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
                    <h1 className="text-2xl font-bold">
                        No se pudo cargar tu cuenta
                    </h1>

                    <p className="mt-3 text-slate-300">
                        Cierra sesión e intenta entrar nuevamente.
                    </p>
                </div>
            </main>
        );
    }

    const courses = dashboard.courses ?? [];
    const certificates = dashboard.certificates ?? [];
    const directusUrl = "https://academy.ouhnou.technology";

    const watchedSeconds = dashboard.studyStats?.watchedSeconds ?? 0;
    const watchedHours = Math.floor(watchedSeconds / 3600);
    const watchedMinutes = Math.floor((watchedSeconds % 3600) / 60);
    const lastActivity = dashboard.lastActivity;

    const displayName = dashboard.student
        ? `${dashboard.student.first_name} ${dashboard.student.last_name}`
        : dashboard.account?.email;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />
            <div className="absolute right-20 top-28 h-40 w-40 animate-pulse rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-20 left-20 h-48 w-48 animate-pulse rounded-full bg-cyan-400/10 blur-3xl" />

            <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 md:py-10">
                <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="logo-font text-sm font-bold uppercase tracking-[0.28em] text-emerald-400 sm:tracking-[0.35em]">
                            Academia Excelandia
                        </p>

                        <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                            Hola, {displayName}
                        </h1>

                        <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
                            Continúa aprendiendo desde donde te quedaste.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="self-start rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-slate-300 backdrop-blur transition hover:border-emerald-400 hover:text-white md:self-auto"
                    >
                        Cerrar sesión
                    </button>
                </header>

                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Estado de cuenta
                        </p>

                        <h2 className="mt-3 text-2xl font-bold text-emerald-300">
                            {dashboard.account?.status ?? "Sin estado"}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Cursos activos
                        </p>

                        <h2 className="mt-3 text-2xl font-bold">
                            {courses.length}
                        </h2>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur">
                        <p className="text-sm text-slate-400">
                            Tiempo estudiado
                        </p>

                        <h2 className="mt-3 text-2xl font-bold">
                            {watchedHours}h {watchedMinutes}m
                        </h2>
                    </div>

                    <a
                        href="/soporte"
                        className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60"
                    >
                        <p className="text-sm text-slate-400">
                            ¿Necesitas ayuda?
                        </p>

                        <h2 className="mt-3 text-2xl font-bold">
                            Centro de ayuda →
                        </h2>
                    </a>
                </div>

                {lastActivity && (
                    <section className="mt-12 rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 backdrop-blur md:p-8">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
                            Continúa aprendiendo
                        </p>

                        <h2 className="mt-3 text-2xl font-black md:text-3xl">
                            {lastActivity.courseTitle}
                        </h2>

                        <p className="mt-3 text-slate-400">
                            Última lección:
                        </p>

                        <p className="font-semibold text-white">
                            {lastActivity.lessonTitle}
                        </p>

                        <a
                            href={lastActivity.continueUrl}
                            className="mt-6 inline-block rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
                        >
                            Continuar lección
                        </a>
                    </section>
                )}

                <section className="mt-12">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-3xl font-black">Mis cursos</h2>

                        <a
                            href="https://www.excelandia.com/tienda"
                            className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
                        >
                            Ir a la tienda →
                        </a>
                    </div>

                    {courses.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center backdrop-blur sm:p-10">
                            <p className="text-xl font-bold">
                                Todavía no tienes cursos activos
                            </p>

                            <p className="mx-auto mt-3 max-w-xl text-slate-400">
                                Cuando compres un material o se active tu
                                inscripción, aparecerá aquí automáticamente.
                            </p>

                            <a
                                href="https://www.excelandia.com/tienda"
                                className="mt-6 inline-block rounded-2xl bg-emerald-400 px-7 py-3 font-bold text-slate-950 transition hover:-translate-y-1 hover:bg-emerald-300"
                            >
                                Explorar tienda
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {courses.map((item: any) => (
                                <article
                                    key={item.enrollment.id}
                                    className="group rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur transition hover:-translate-y-2 hover:border-emerald-400/70 hover:shadow-[0_0_40px_rgba(52,211,153,0.12)]"
                                >
                                    <div className="mb-5 h-32 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/10 transition group-hover:scale-[1.02]" />

                                    <h3 className="text-xl font-bold">
                                        {item.course?.title ?? "Curso sin título"}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        Estado: {item.enrollment.status}
                                    </p>

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-slate-400">
                                                Progreso
                                            </span>

                                            <span className="font-bold text-emerald-300">
                                                {item.progressPercent}%
                                            </span>
                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-emerald-400 transition-all"
                                                style={{
                                                    width: `${item.progressPercent}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            {item.completedLessons} de{" "}
                                            {item.totalLessons} lecciones
                                            completadas
                                        </p>
                                    </div>

                                    <p className="mt-5 text-sm text-slate-500">
                                        Vigencia:
                                    </p>

                                    <p className="text-sm text-slate-300">
                                        {item.enrollment.starts_at
                                            ? new Date(
                                                item.enrollment.starts_at
                                            ).toLocaleDateString("es-MX")
                                            : "Sin fecha de inicio"}{" "}
                                        —{" "}
                                        {item.enrollment.ends_at
                                            ? new Date(
                                                item.enrollment.ends_at
                                            ).toLocaleDateString("es-MX")
                                            : "Sin fecha de fin"}
                                    </p>

                                    {item.continueUrl ? (
                                        <a
                                            href={item.continueUrl}
                                            className="mt-6 block w-full rounded-2xl bg-emerald-400 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                                        >
                                            Continuar curso
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="mt-6 w-full rounded-2xl bg-slate-800 px-5 py-3 font-bold text-slate-500"
                                        >
                                            Sin lecciones disponibles
                                        </button>
                                    )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-12">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-3xl font-black">
                            Mis certificados
                        </h2>
                    </div>

                    {certificates.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
                            Todavía no tienes certificados emitidos.
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {certificates.map((certificate: any) => (
                                <article
                                    key={certificate.id}
                                    className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-6 backdrop-blur"
                                >
                                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-400">
                                        Certificado
                                    </p>

                                    <h3 className="mt-3 text-2xl font-black">
                                        {certificate.course_id?.title ?? "Curso"}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400">
                                        Folio:{" "}
                                        <span className="break-all text-slate-200">
                                            {certificate.certificate_number}
                                        </span>
                                    </p>

                                    <p className="mt-1 text-sm text-slate-400">
                                        Emitido:{" "}
                                        <span className="text-slate-200">
                                            {certificate.completed_at
                                                ? new Date(
                                                    certificate.completed_at
                                                ).toLocaleDateString("es-MX")
                                                : "Sin fecha"}
                                        </span>
                                    </p>

                                    <div className="mt-6 flex flex-col gap-3 md:flex-row">
                                        {certificate.pdf_file?.id && (
                                            <a
                                                href={`${directusUrl}/assets/${certificate.pdf_file.id}?download`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-2xl bg-emerald-400 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-emerald-300"
                                            >
                                                Descargar PDF
                                            </a>
                                        )}

                                        <a
                                            href={`/certificados/${certificate.verification_code}`}
                                            target="_blank"
                                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center font-bold text-slate-300 transition hover:border-emerald-400 hover:text-white"
                                        >
                                            Verificar
                                        </a>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}