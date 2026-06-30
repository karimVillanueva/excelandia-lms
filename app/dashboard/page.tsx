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
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-4 text-white">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-5 py-4 text-sm">
                    Cargando tu academia...
                </div>
            </main>
        );
    }

    if (!dashboard) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-4 text-white">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center">
                    <h1 className="text-lg font-bold">
                        No se pudo cargar tu cuenta
                    </h1>
                    <p className="mt-2 text-sm text-slate-300">
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

    const firstName = String(displayName ?? "").split(" ")[0] ?? "";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] pb-20 text-white md:pb-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e44,transparent_32%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_34%)]" />

            <section className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-10">
                <header className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[12px] font-black uppercase tracking-[0.28em] text-slate-300 sm:text-sm">
                            Academia{" "}
                            <span className="text-emerald-400">
                                Excelandia
                            </span>
                        </p>

                        <h1 className="mt-8 text-[2rem] font-black leading-tight sm:text-5xl lg:text-6xl">
                            Hola,{" "}
                            <span className="text-emerald-400">
                                {firstName}
                            </span>
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-lg">
                            Continúa aprendiendo desde donde te quedaste.
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        aria-label="Cerrar sesión"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-xl text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 sm:h-auto sm:w-auto sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm sm:font-bold"
                    >
                        <span className="sm:hidden">↪</span>
                        <span className="hidden sm:inline">↪ Cerrar sesión</span>
                    </button>
                </header>

                {lastActivity && (
                    <section className="mb-7 overflow-hidden rounded-[1.7rem] border border-emerald-400/30 bg-slate-900/75 p-5 shadow-[0_0_45px_rgba(16,185,129,0.12)] backdrop-blur lg:p-8">
                        <div className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
                            <div>
                                <p className="inline-flex rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400 sm:text-sm">
                                    Continúa aprendiendo
                                </p>

                                <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                                    {lastActivity.courseTitle}
                                </h2>

                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-400/10 text-emerald-300">
                                        ▶
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-400 sm:text-sm">
                                            Última lección
                                        </p>
                                        <p className="text-sm font-bold sm:text-base">
                                            {lastActivity.lessonTitle}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p className="mb-2 flex justify-between text-xs text-slate-400">
                                        <span>Progreso</span>
                                        <span className="font-bold text-emerald-300">
                                            {courses[0]?.progressPercent ?? 0}%
                                        </span>
                                    </p>

                                    <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                                        <div
                                            className="h-full rounded-full bg-emerald-400"
                                            style={{
                                                width: `${courses[0]?.progressPercent ??
                                                    0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <a
                                    href={lastActivity.continueUrl}
                                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-5 py-3.5 text-sm font-black text-slate-950 transition hover:bg-emerald-300 sm:w-fit sm:px-8 sm:text-base"
                                >
                                    ▶ Continuar lección
                                </a>
                            </div>

                            <div className="hidden justify-center lg:flex">
                                <div className="flex h-40 w-40 items-center justify-center rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 text-6xl shadow-[0_0_60px_rgba(16,185,129,0.18)]">
                                    🎓
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mb-8">
                    <h2 className="mb-4 text-xl font-black sm:text-2xl">
                        Resumen de tu aprendizaje
                    </h2>

                    <div className="overflow-hidden rounded-[1.7rem] border border-slate-800 bg-slate-900/70 backdrop-blur">
                        <SummaryRow
                            icon="●"
                            label="Estado de cuenta"
                            value={dashboard.account?.status ?? "Sin estado"}
                            highlight
                        />

                        <SummaryRow
                            icon="◈"
                            label="Cursos activos"
                            value={courses.length}
                        />

                        <SummaryRow
                            icon="◷"
                            label="Tiempo estudiado"
                            value={`${watchedHours}h ${watchedMinutes}m`}
                        />

                        <a
                            href="/soporte"
                            className="flex items-center gap-4 border-t border-slate-800 px-4 py-4 transition hover:bg-slate-800/40 sm:px-5"
                        >
                            <IconBubble>☎</IconBubble>

                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-slate-400">
                                    ¿Necesitas ayuda?
                                </p>
                                <p className="font-black text-emerald-300">
                                    Centro de ayuda
                                </p>
                            </div>

                            <span className="text-xl text-emerald-300">↗</span>
                        </a>
                    </div>
                </section>

                <section className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Mis cursos
                        </h2>

                        <a
                            href="https://www.excelandia.com/tienda"
                            className="text-sm font-bold text-emerald-400 hover:text-emerald-300"
                        >
                            Ver todos →
                        </a>
                    </div>

                    {courses.length === 0 ? (
                        <EmptyCard
                            title="Todavía no tienes cursos activos"
                            text="Cuando compres un material o se active tu inscripción, aparecerá aquí automáticamente."
                        />
                    ) : (
                        <div className="grid gap-4 xl:grid-cols-2">
                            {courses.map((item: any) => (
                                <article
                                    key={item.enrollment.id}
                                    className="rounded-[1.7rem] border border-slate-800 bg-slate-900/70 p-4 backdrop-blur transition hover:border-emerald-400/60 sm:p-5"
                                >
                                    <div className="grid gap-4 sm:grid-cols-[140px_1fr] lg:grid-cols-[180px_1fr]">
                                        <div className="flex min-h-28 items-end rounded-2xl bg-gradient-to-br from-emerald-400/20 via-teal-900/30 to-slate-950 p-4">
                                            <span className="text-2xl font-black text-emerald-300">
                                                {item.course?.title ?? "Curso"}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between gap-3">
                                                <div>
                                                    <h3 className="text-2xl font-black">
                                                        {item.course?.title ??
                                                            "Curso sin título"}
                                                    </h3>

                                                    <span className="mt-2 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                                                        {item.enrollment.status}
                                                    </span>
                                                </div>

                                                {item.continueUrl && (
                                                    <a
                                                        href={item.continueUrl}
                                                        className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/70 text-xl text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300 sm:flex"
                                                    >
                                                        ›
                                                    </a>
                                                )}
                                            </div>

                                            <div className="mt-5">
                                                <div className="mb-2 flex justify-between text-sm">
                                                    <span className="text-slate-400">
                                                        Progreso
                                                    </span>
                                                    <span className="font-black text-emerald-300">
                                                        {item.progressPercent}%
                                                    </span>
                                                </div>

                                                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                                                    <div
                                                        className="h-full rounded-full bg-emerald-400"
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

                                            <p className="mt-4 text-xs text-slate-500">
                                                Vigencia:
                                            </p>

                                            <p className="text-sm font-semibold text-slate-300">
                                                {item.enrollment.starts_at
                                                    ? new Date(
                                                        item.enrollment.starts_at
                                                    ).toLocaleDateString(
                                                        "es-MX"
                                                    )
                                                    : "Sin fecha"}{" "}
                                                —{" "}
                                                {item.enrollment.ends_at
                                                    ? new Date(
                                                        item.enrollment.ends_at
                                                    ).toLocaleDateString(
                                                        "es-MX"
                                                    )
                                                    : "Sin fecha"}
                                            </p>

                                            {item.continueUrl && (
                                                <a
                                                    href={item.continueUrl}
                                                    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 sm:hidden"
                                                >
                                                    Continuar curso →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-2xl font-black sm:text-3xl">
                            Mis certificados
                        </h2>

                        <a
                            href="#"
                            className="text-sm font-bold text-emerald-400"
                        >
                            Ver todos →
                        </a>
                    </div>

                    {certificates.length === 0 ? (
                        <div className="flex items-center gap-4 rounded-[1.7rem] border border-slate-800 bg-slate-900/70 p-4">
                            <IconBubble>▤</IconBubble>

                            <div className="min-w-0 flex-1">
                                <p className="font-bold text-slate-200">
                                    Todavía no tienes certificados emitidos.
                                </p>
                                <p className="mt-1 text-sm text-slate-400">
                                    Completa tus cursos para obtener tu
                                    certificado.
                                </p>
                            </div>

                            <span className="text-xl text-slate-500">›</span>
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {certificates.map((certificate: any) => (
                                <article
                                    key={certificate.id}
                                    className="rounded-[1.7rem] border border-emerald-400/20 bg-slate-900/70 p-5"
                                >
                                    <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-400">
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

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        {certificate.pdf_file?.id && (
                                            <a
                                                href={`${directusUrl}/assets/${certificate.pdf_file.id}?download`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-black text-slate-950"
                                            >
                                                Descargar PDF
                                            </a>
                                        )}

                                        <a
                                            href={`/certificados/${certificate.verification_code}`}
                                            target="_blank"
                                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-slate-300"
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

            <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-800 bg-[#02070F]/95 px-4 py-2 backdrop-blur md:hidden">
                <div className="mx-auto grid max-w-md grid-cols-4 text-center text-xs">
                    <a className="text-emerald-400" href="/dashboard">
                        <div className="text-xl">⌂</div>
                        Inicio
                    </a>
                    <a className="text-slate-500" href="#cursos">
                        <div className="text-xl">□</div>
                        Cursos
                    </a>
                    <a className="text-slate-500" href="#certificados">
                        <div className="text-xl">▤</div>
                        Certificados
                    </a>
                    <a className="text-slate-500" href="/soporte">
                        <div className="text-xl">○</div>
                        Perfil
                    </a>
                </div>
            </nav>
        </main>
    );
}

function SummaryRow({
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
        <div className="flex items-center gap-4 border-t border-slate-800 px-4 py-4 first:border-t-0 sm:px-5">
            <IconBubble>{icon}</IconBubble>

            <p className="min-w-0 flex-1 text-sm text-slate-400 sm:text-base">
                {label}
            </p>

            <p
                className={`text-base font-black sm:text-lg ${highlight ? "text-emerald-300" : "text-white"
                    }`}
            >
                {value}
            </p>

            <span className="text-slate-500">›</span>
        </div>
    );
}

function IconBubble({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-sm text-emerald-300">
            {children}
        </div>
    );
}

function EmptyCard({
    title,
    text,
}: {
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[1.7rem] border border-dashed border-slate-700 bg-slate-900/50 p-5 text-center">
            <p className="font-bold text-slate-200">{title}</p>
            <p className="mt-2 text-sm text-slate-400">{text}</p>
        </div>
    );
}