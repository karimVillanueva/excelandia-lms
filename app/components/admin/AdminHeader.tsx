// app/components/admin/AdminHeader.tsx

import Link from "next/link";

interface Props {
    eyebrow?: string;
    title: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
    actions?: React.ReactNode;
}

export default function AdminHeader({
    eyebrow = "Academia Excelandia",
    title,
    description,
    backHref,
    backLabel = "Volver",
    actions,
}: Props) {
    return (
        <header className="mb-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
                {backHref && (
                    <Link
                        href={backHref}
                        className="mb-4 inline-flex text-sm text-slate-400 transition hover:text-white"
                    >
                        ← {backLabel}
                    </Link>
                )}

                <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                    {eyebrow}
                </p>

                <h1 className="mt-4 text-4xl font-black text-white md:text-5xl">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 max-w-2xl text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {actions}

                <a
                    href="/api/logout"
                    className="rounded-2xl border border-red-500/40 bg-red-500/5 px-5 py-3 font-bold text-red-300 transition hover:bg-red-500/10"
                >
                    Cerrar sesión
                </a>
            </div>
        </header>
    );
}