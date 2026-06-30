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
                    <h1 className="text-lg font-bold">No se pudo cargar tu cuenta</h1>
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

    const nameParts = String(displayName ?? "").split(" ");
    const firstName = nameParts[0] ?? "";
    const restName = nameParts.slice(1).join(" ");

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_34%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_34%)]" />

            <section className="relative z-10 mx-auto w-full max-w-7xl px-3 py-5 min-[390px]:px-4 sm:px-6 lg:px-8 lg:py-12">
                <header className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-400 min-[390px]:text-[11px] sm:text-sm sm:tracking-[0.45em]">
                        Academia Excelandia
                    </p>

                    <h1 className="mt-3 text-[2rem] font-black leading-[1.04] min-[390px]:text-[2.25rem] sm:mt-5 sm:text-5xl lg:text-6xl">
                        Hola,{" "}
                        <span className="text-emerald-400">{firstName}</span>
                        <br />
                        {restName}
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-lg">
                        Continúa aprendiendo desde donde te quedaste.
                    </p>

                    <button
                        onClick={logout}
                        className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm font-bold text-slate-200 transition hover:border-emerald-400 hover:text-white lg:absolute lg:right-8 lg:top-10 lg:mt-0"
                    >
                        ↪ Cerrar sesión
                    </button>
                </header>

                <div className="grid gap-3 min-[520px]:grid-cols-2 xl:grid-cols-4">
                    <DashboardMetric
                        label="Estado de cuenta"
                        value={dashboard.account?.status ?? "Sin estado"}
                        highlight
                    />

                    <DashboardMetric
                        label="Cursos activos"
                        value={courses.length}
                    />

                    <DashboardMetric
                        label="Tiempo estudiado"
                        value={`${watchedHours}h ${watchedMinutes}m`}
                    />

                    <a
                        href="/soporte"
                        className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-emerald-400/60 sm:rounded-3xl sm:p-5 lg:p-6"
                    >
                        <p className="text-xs text-slate-400 sm:text-sm">
                            ¿Necesitas ayuda?
                        </p>

                        <h2 className="mt-2 text-xl font-black text-emerald-300 sm:text-2xl">
                            Centro de ayuda →
                        </h2>
                    </a>
                </div>

                {lastActivity && (
                    <section className="mt-5 rounded-2xl border border-emerald-400/40 bg-slate-900/70 p-4 shadow-[0_0_35px_rgba(16,185,129,0.12)] sm:mt-8 sm:rounded-3xl sm:p-6 lg:p-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-emerald-400 sm:text-sm sm:tracking-[0.35em]">
                            Continúa aprendiendo
                        </p>

                        <h2 className="mt-3 text-2xl font-black sm:text-4xl">
                            {lastActivity.courseTitle}
                        </h2>

                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-400/10 text-xs text-emerald-300 sm:h-11 sm:w-11">
                                ▶
                            </div>

                            <div>
                                <p className="text-xs text-slate-400 sm:text-sm">
                                    Última lección:
                                </p>

                                <p className="text-sm font-bold sm:text-base">
                                    {lastActivity.lessonTitle}
                                </p>
                            </div>
                        </div>

                        <a
                            href={lastActivity.continueUrl}
                            className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 sm:w-fit sm:px-7 sm:text-base"
                        >
                            ▶ Continuar lección
                        </a>
                    </section>
                )}

                <section className="mt-8 sm:mt-12">
                    <div className="mb-4 flex items-end justify-between gap-3">
                        <h2 className="text-3xl font-black sm:text-4xl">
                            Mis cursos
                        </h2>

                        <a
                            href="https://www.excelandia.com/tienda"
                            className="text-xs font-bold text-emerald-400 transition hover:text-emerald-300 sm:text-sm"
                        >
                            Ir a la tienda →
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
                                    className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:rounded-3xl sm:p-5 lg:p-6"
                                >
                                    <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
                                        <div className="flex min-h-28 items-end rounded-2xl bg-gradient-to-br from-emerald-400/20 via-teal-900/30 to-slate-950 p-4 sm:min-h-40 lg:min-h-48">
                                            <span className="text-2xl font-black text-emerald-300 sm:text-3xl">
                                                {item.course?.title ?? "Curso"}
                                            </span>
                                        </div>

                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-2xl font-black sm:text-3xl">
                                                    {item.course?.title ?? "Curso sin título"}
                                                </h3>

                                                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                                                    {item.enrollment.status}
                                                </span>
                                            </div>

                                            <div className="mt-4">
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
                                                        className="h-full rounded-full bg-emerald-400"
                                                        style={{
                                                            width: `${item.progressPercent}%`,
                                                        }}
                                                    />
                                                </div>

                                                <p className="mt-2 text-xs text-slate-500">
                                                    {item.completedLessons} de{" "}
                                                    {item.totalLessons} lecciones completadas
                                                </p>
                                            </div>

                                            <p className="mt-4 text-xs text-slate-500">
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
                                                    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300 sm:text-base"
                                                >
                                                    Continuar curso →
                                                </a>
                                            ) : (
                                                <button
                                                    disabled
                                                    className="mt-5 w-full rounded-2xl bg-slate-800 px-5 py-3 text-sm font-bold text-slate-500"
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

                <section className="mt-9 sm:mt-14">
                    <h2 className="mb-4 text-3xl font-black sm:text-4xl">
                        Mis certificados
                    </h2>

                    {certificates.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-slate-400 sm:rounded-3xl sm:p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-400/10 text-xl text-emerald-300">
                                ▤
                            </div>

                            <p className="text-base font-semibold text-slate-300">
                                Todavía no tienes certificados emitidos.
                            </p>

                            <p className="mt-1 text-sm">
                                Completa tus cursos para obtener tu certificado.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {certificates.map((certificate: any) => (
                                <article
                                    key={certificate.id}
                                    className="rounded-2xl border border-emerald-400/20 bg-slate-900/70 p-5 sm:rounded-3xl sm:p-6"
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
                                                ? new Date(certificate.completed_at).toLocaleDateString("es-MX")
                                                : "Sin fecha"}
                                        </span>
                                    </p>

                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                        {certificate.pdf_file?.id && (
                                            <a
                                                href={`${directusUrl}/assets/${certificate.pdf_file.id}?download`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-2xl bg-emerald-400 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-emerald-300"
                                            >
                                                Descargar PDF
                                            </a>
                                        )}

                                        <a
                                            href={`/certificados/${certificate.verification_code}`}
                                            target="_blank"
                                            className="rounded-2xl border border-slate-700 px-5 py-3 text-center text-sm font-bold text-slate-300 transition hover:border-emerald-400 hover:text-white"
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
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string | number;
    highlight?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:rounded-3xl sm:p-5 lg:p-6">
            <p className="text-xs text-slate-400 sm:text-sm">{label}</p>

            <h2
                className={`mt-2 text-2xl font-black sm:text-3xl ${highlight ? "text-emerald-300" : "text-white"
                    }`}
            >
                {value}
            </h2>
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
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-5 text-center sm:rounded-3xl sm:p-8">
            <p className="text-base font-bold sm:text-xl">{title}</p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400 sm:text-base">
                {text}
            </p>
        </div>
    );
}