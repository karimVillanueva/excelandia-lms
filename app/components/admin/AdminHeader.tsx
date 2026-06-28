import Link from "next/link";

interface Props {
    title: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
    actions?: React.ReactNode;
}

export default function AdminHeader({
    title,
    description,
    backHref,
    backLabel = "Volver",
    actions,
}: Props) {
    return (
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                {backHref && (
                    <Link
                        href={backHref}
                        className="mb-3 inline-flex text-sm text-slate-400 hover:text-white"
                    >
                        ← {backLabel}
                    </Link>
                )}

                <h1 className="text-3xl font-bold text-white">
                    {title}
                </h1>

                {description && (
                    <p className="mt-2 text-slate-400">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {actions}

                <a
                    href="/api/logout"
                    className="rounded-2xl border border-red-500/40 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-500/10"
                >
                    Cerrar sesión
                </a>
            </div>
        </header>
    );
}