export default function SoportePage() {
    return (
        <main className="min-h-screen bg-[#02070F] text-white">
            <section className="mx-auto max-w-5xl px-6 py-20">
                <h1 className="text-center text-5xl font-black">
                    Centro de ayuda
                </h1>

                <p className="mt-6 text-center text-lg text-slate-400">
                    ¿Necesitas ayuda para acceder a tus materiales?
                </p>

                <div className="mt-16 grid gap-6 md:grid-cols-2">
                    <a
                        href={process.env.NEXT_PUBLIC_COGNITO_HOSTED_UI + "/forgotPassword"}
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-emerald-400"
                    >
                        <h2 className="text-2xl font-bold">
                            🔐 Olvidé mi contraseña
                        </h2>

                        <p className="mt-4 text-slate-400">
                            Restablece la contraseña de tu cuenta.
                        </p>
                    </a>

                    <a
                        href="mailto:soporte@excelandia.com"
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-emerald-400"
                    >
                        <h2 className="text-2xl font-bold">
                            📚 No encuentro mi curso
                        </h2>

                        <p className="mt-4 text-slate-400">
                            Escríbenos y revisaremos tu acceso.
                        </p>
                    </a>

                    <a
                        href="mailto:soporte@excelandia.com"
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-emerald-400"
                    >
                        <h2 className="text-2xl font-bold">
                            💳 Problemas con una compra
                        </h2>

                        <p className="mt-4 text-slate-400">
                            Te ayudamos con pagos y facturación.
                        </p>
                    </a>

                    <a
                        href="https://wa.me/52XXXXXXXXXX"
                        target="_blank"
                        className="rounded-3xl border border-slate-800 bg-slate-900 p-8 transition hover:-translate-y-1 hover:border-emerald-400"
                    >
                        <h2 className="text-2xl font-bold">
                            💬 Contactar soporte
                        </h2>

                        <p className="mt-4 text-slate-400">
                            Habla directamente con nuestro equipo.
                        </p>
                    </a>
                </div>
            </section>
        </main>
    );
}