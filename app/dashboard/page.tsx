"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    async function logout() {
        const response = await fetch("/api/logout", { method: "POST" });
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

                setDashboard(await response.json());
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
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-4 text-white">
                <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900/70 px-6 py-5 text-sm">
                    Cargando tu academia...
                </div>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-4 text-white">
                <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-center">
                    <h1 className="text-xl font-bold">No se pudo cargar tu cuenta</h1>
                    <p className="mt-3 text-sm text-slate-300">
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

    const nameParts = String(displayName ?? "").split(" ");
    const firstName = nameParts[0] ?? "";
    const restName = nameParts.slice(1).join(" ");

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />
            <div className="absolute right-[-110px] top-16 h-52 w-52 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="absolute bottom-20 left-[-110px] h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

            <section className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-12">
                <header className="mb-7 grid gap-5 sm:mb-10 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.34em] text-emerald-400 sm:text-sm sm:tracking-[0.45em]">
                            Academia Excelandia
                        </p>

                        <h1 className="mt-4 max-w-4xl text-[2.1rem] font-black leading-[1.04] sm:mt-6 sm:text-5xl lg:text-6xl">
                            Hola,{" "}
                            <span className="text-emerald-400">
                                {firstName}
                            </span>
                            <br />
                            {restName}
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg">
                            Continúa aprendiendo desde donde te quedaste.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="inline-flex w-fit items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-bold text-slate-200 backdrop-blur transition hover:border-emerald-400 hover:text-white lg:mt-14"
                    >
                        <span className="text-base">↪</span>
                        Cerrar sesión
                    </button>
                </header>

                <div className="grid gap-4 min-[520px]:grid-cols-2 xl:grid-cols-4">
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
                        className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60 sm:p-6"
                    >
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-xl text-emerald-300 sm:mb-6 sm:h-14 sm:w-14 sm:text-2xl">
                            ☎
                        </div>

                        <p className="text-sm text-slate-400">¿Necesitas ayuda?</p>

                        <h2 className="mt-2 text-xl font-black text-emerald-300 sm:text-2xl">
                            Centro de ayuda →
                        </h2>
                    </a>
                </div>

                {lastActivity && (
                    <section className="mt-7 overflow-hidden rounded-3xl border border-emerald-400/40 bg-slate-900/70 p-5 shadow-[0_0_50px_rgba(16,185,129,0.16)] backdrop-blur sm:mt-8 sm:p-6 md:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_260px] lg:items-center">
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-400 sm:text-sm sm:tracking-[0.35em]">
                                    Continúa aprendiendo
                                </p>

                                <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                                    {lastActivity.courseTitle}
                                </h2>

                                <div className="mt-5 flex items-start gap-3 sm:gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-sm text-emerald-300 sm:h-12 sm:w-12">
                                        ▶
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400 sm:text-base">
                                            Última lección:
                                        </p>

                                        <p className="mt-1 text-base font-bold sm:text-lg">
                                            {lastActivity.lessonTitle}
                                        </p>
                                    </div>
                                </div>

                                <a
                                    href={lastActivity.continueUrl}
                                    className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-4 text-center font-black text-slate-950 transition hover:bg-emerald-300 sm:w-auto sm:min-w-64"
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

                <section className="mt-9 sm:mt-12">
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <h2 className="text-3xl font-black sm:text-4xl">
                            Mis cursos
                        </h2>

                        <a
                            href="https://www.excelandia.com/tienda"
                            className="text-sm font-bold text-emerald-400 transition hover:text-emerald-300"
                        >
                            Ir a la tienda →
                        </a>
                    </div>

                    {courses.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-center backdrop-blur sm:p-10">
                            <p className="text-lg font-bold sm:text-xl">
                                Todavía no tienes cursos activos
                            </p>

                            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400 sm:text-base">
                                Cuando compres un material o se active tu
                                inscripción, aparecerá aquí automáticamente.
                            </p>

                            <a
                                href="https://www.excelandia.com/tienda"
                                className="mt-6 inline-block rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
                            >
                                Explorar tienda
                            </a>
                        </div>
                    ) : (
                        <div className="grid gap-5 xl:grid-cols-2">
                            {courses.map((item: any) => (
                                <article
                                    key={item.enrollment.id}
                                    className="group overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur transition hover:border-emerald-400/70 hover:shadow-[0_0_40px_rgba(52,211,153,0.12)] sm:p-6"
                                >
                                    <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                                        <div className="flex min-h-36 items-end rounded-[1.25rem] bg-gradient-to-br from-emerald-400/20 via-teal-900/30 to-slate-950 p-5 sm:min-h-44 sm:p-6 lg:min-h-52">
                                            <span className="text-2xl font-black text-emerald-300 sm:text-3xl">
                                                {item.course?.title ?? "Curso"}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-2xl font-black sm:text-3xl">
                                                    {item.course?.title ?? "Curso sin título"}
                                                </h3>

                                                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                                                    {item.enrollment.status}
                                                </span>
                                            </div>

                                            <div className="mt-5 sm:mt-6">
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

                                                <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                                                    {item.completedLessons} de{" "}
                                                    {item.totalLessons} lecciones completadas
                                                </p>
                                            </div>

                                            <p className="mt-5 text-sm text-slate-500 sm:mt-6">
                                                Vigencia:
                                            </p>

                                            <p className="text-sm font-semibold text-slate-300">
                                                {item.enrollment.starts_at
                                                    ? new Date(item.enrollment.starts_at).toLocaleDateString("es-MX")
                                                    : "Sin fecha de inicio"}{" "}
                                                —{" "}
                                                {item.enrollment.ends_at
                                                    ? new Date(item.enrollment.ends_at).toLocaleDateString("es-MX")
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

                <section className="mt-10 sm:mt-14">
                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-3xl font-black sm:text-4xl">
                            Mis certificados
                        </h2>
                    </div>

                    {certificates.length === 0 ? (
                        <div className="flex flex-col gap-4 rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-6 text-slate-400 backdrop-blur sm:flex-row sm:items-center sm:p-8">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-2xl text-emerald-300 sm:h-16 sm:w-16 sm:text-3xl">
                                ▤
                            </div>

                            <div>
                                <p className="text-base font-semibold text-slate-300 sm:text-lg">
                                    Todavía no tienes certificados emitidos.
                                </p>

                                <p className="mt-1 text-sm sm:text-base">
                                    Completa tus cursos para obtener tu certificado.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-2">
                            {certificates.map((certificate: any) => (
                                <article
                                    key={certificate.id}
                                    className="rounded-3xl border border-emerald-400/20 bg-slate-900/70 p-5 backdrop-blur sm:p-6"
                                >
                                    <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400 sm:text-sm">
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
                                                ? new Date(certificate.completed_at).toLocaleDateString("es-MX")
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
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-[0_0_40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-6">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-xl text-emerald-300 sm:mb-6 sm:h-14 sm:w-14 sm:text-2xl">
                {icon}
            </div>

            <p className="text-sm text-slate-400">{label}</p>

            <h2
                className={`mt-2 text-2xl font-black sm:mt-3 sm:text-3xl ${highlight ? "text-emerald-300" : "text-white"
                    }`}
            >
                {value}
            </h2>
        </div>
    );
}