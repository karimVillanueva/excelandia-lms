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
            <div className="absolute right-[-80px] top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-20 left-[-80px] h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

            <section className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-12">
                <header className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.45em] text-emerald-400 sm:text-sm">
                            Academia Excelandia
                        </p>

                        <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">
                            Hola,{" "}
                            <span className="text-emerald-400">
                                {displayName?.split(" ")[0] ?? ""}
                            </span>
                            <br />
                            {displayName
                                ?.split(" ")
                                .slice(1)
                                .join(" ") ?? ""}
                        </h1>

                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                            Continúa aprendiendo desde donde te quedaste.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="inline-flex w-fit items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-bold text-slate-200 backdrop-blur transition hover:border-emerald-400 hover:text-white lg:mt-14"
                    >
                        <span className="text-lg">↪</span>
                        Cerrar sesión
                    </button>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardMetric
                        icon="●"
                        label="Estado de cuenta"
                        value={dashboard.account?.status ?? "Sin estado"}
                        highlight
                    />

                    <DashboardMetric
                        icon="◈"
                        label="Cursos activos"
                        value={courses.length}
                    />

                    <DashboardMetric
                        icon="◷"
                        label="Tiempo estudiado"
                        value={`${watchedHours}h ${watchedMinutes}m`}
                    />

                    <a
                        href="/soporte"
                        className="group rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60"
                    >
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-300">
                            ☎
                        </div>

                        <p className="text-sm text-slate-400">
                            ¿Necesitas ayuda?
                        </p>

                        <h2 className="mt-2 text-2xl font-black text-emerald-300">
                            Centro de ayuda →
                        </h2>
                    </a>
                </div>

                {lastActivity && (
                    <section className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-400/40 bg-slate-900/70 p-6 shadow-[0_0_50px_rgba(16,185,129,0.16)] backdrop-blur md:p-8">
                        <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
                            <div>
                                <p className="text-sm font-black uppercase tracking-[0.35em] text-emerald-400">
                                    Continúa aprendiendo
                                </p>

                                <h2 className="mt-5 text-4xl font-black">
                                    {lastActivity.courseTitle}
                                </h2>

                                <div className="mt-6 flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
                                        ▶
                                    </div>

                                    <div>
                                        <p className="text-slate-400">
                                            Última lección:
                                        </p>

                                        <p className="mt-1 text-lg font-bold">
                                            {lastActivity.lessonTitle}
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href={lastActivity.continueUrl}
                                    className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-7 py-4 text-center font-black text-slate-950 transition hover:bg-emerald-300 sm:w-auto sm:min-w-72"
                                >
                                    ▶ Continuar lección
                                </a>
                            </div>

                            <div className="hidden justify-center lg:flex">
                                <div className="relative h-44 w-44 rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 shadow-[0_0_60px_rgba(16,185,129,0.25)]">
                                    <div className="absolute inset-8 rounded-3xl border border-emerald-400/30 bg-slate-950/70" />
                                    <div className="absolute inset-x-10 bottom-10 h-7 rounded-full bg-emerald-400/80 blur-sm" />
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">
                                        🎓
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mt-12">
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <h2 className="text-4xl font-black">Mis cursos</h2>

                        <a
                            href="https://www.excelandia.com/tienda"
                            className="text-sm font-bold text-emerald-400 transition hover:text-emerald-300"
                        >
                            Ir a la tienda →
                        </a>
                    </div>

                    {courses.length === 0 ? (
                        <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center backdrop-blur sm:p-10">
                            <p className="text-xl font-bold">
                                Todavía no tienes cursos activos
                            </p>

                            <p className="mx-auto mt-3 max-w-xl text-slate-400">
                                Cuando compres un material o se active tu
                                inscripción, aparecerá aquí automáticamente.
                            </p>

                            <a
                                href="https://www.excelandia.com/tienda"
                                className="mt-6 inline-block rounded-2xl bg-emerald-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
                            >
                                Explorar tienda
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-6 xl:grid-cols-2">
                            {courses.map((item: any) => (
                                <article
                                    key={item.enrollment.id}
                                    className="group overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/70 p-5 backdrop-blur transition hover:border-emerald-400/70 hover:shadow-[0_0_40px_rgba(52,211,153,0.12)] sm:p-6"
                                >
                                    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                                        <div className="flex min-h-52 items-end rounded-[1.5rem] bg-gradient-to-br from-emerald-400/20 via-teal-900/30 to-slate-950 p-6">
                                            <span className="text-3xl font-black text-emerald-300">
                                                {item.course?.title ?? "Curso"}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-3xl font-black">
                                                    {item.course?.title ??
                                                        "Curso sin título"}
                                                </h3>

                                                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                                                    {item.enrollment.status}
                                                </span>
                                            </div>

                                            <div className="mt-6">
                                                <div className="mb-2 flex items-center justify-between text-sm">
                                                    <span className="text-slate-400">
                                                        Progreso
                                                    </span>

                                                    <span className="font-black text-emerald-300">
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

                                                <p className="mt-2 text-sm text-slate-500">
                                                    {item.completedLessons} de{" "}
                                                    {item.totalLessons} lecciones
                                                    completadas
                                                </p>
                                            </div>

                                            <p className="mt-6 text-sm text-slate-500">
                                                Vigencia:
                                            </p>

                                            <p className="text-sm font-semibold text-slate-300">
                                                {item.enrollment.starts_at
                                                    ? new Date(
                                                        item.enrollment.starts_at
                                                    ).toLocaleDateString(
                                                        "es-MX"
                                                    )
                                                    : "Sin fecha de inicio"}{" "}
                                                —{" "}
                                                {item.enrollment.ends_at
                                                    ? new Date(
                                                        item.enrollment.ends_at
                                                    ).toLocaleDateString(
                                                        "es-MX"
                                                    )
                                                    : "Sin fecha de fin"}
                                            </p>

                                            {item.continueUrl ? (
                                                <a
                                                    href={item.continueUrl}
                                                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 text-center font-black text-slate-950 transition hover:bg-emerald-300"
                                                >
                                                    Continuar curso →
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="mt-6 w-full rounded-2xl bg-slate-800 px-5 py-4 font-bold text-slate-500"
                                                >
                                                    Sin lecciones disponibles
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="mt-14">
                    <div className="mb-6">
                        <h2 className="text-4xl font-black">
                            Mis certificados
                        </h2>
                    </div>

                    {certificates.length === 0 ? (
                        <div className="flex flex-col gap-5 rounded-[2rem] border border-dashed border-slate-700 bg-slate-900/40 p-8 text-slate-400 backdrop-blur sm:flex-row sm:items-center">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-3xl text-emerald-300">
                                ▤
                            </div>

                            <div>
                                <p className="text-lg font-semibold text-slate-300">
                                    Todavía no tienes certificados emitidos.
                                </p>

                                <p className="mt-1">
                                    Completa tus cursos para obtener tu
                                    certificado.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {certificates.map((certificate: any) => (
                                <article
                                    key={certificate.id}
                                    className="rounded-[2rem] border border-emerald-400/20 bg-slate-900/70 p-6 backdrop-blur"
                                >
                                    <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-400">
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
                                                className="rounded-2xl bg-emerald-400 px-5 py-3 text-center font-black text-slate-950 transition hover:bg-emerald-300"
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

function DashboardMetric({
    icon,
    label,
    value,
    highlight = false,
}: {
    icon: string;
    label: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-[2rem] border border-slate-800 bg-slate-900/60 p-6 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-300">
                {icon}
            </div>

            <p className="text-sm text-slate-400">{label}</p>

            <h2
                className={`mt-3 text-3xl font-black ${highlight ? "text-emerald-300" : "text-white"
                    }`}
            >
                {value}
            </h2>
        </div>
    );
}