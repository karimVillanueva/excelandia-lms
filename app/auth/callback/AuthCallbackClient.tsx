// app/auth/callback/AuthCallbackClient.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState("");

    useEffect(() => {
        const code = searchParams.get("code");
        const errorParam = searchParams.get("error");

        if (errorParam) {
            setError("No se pudo iniciar sesión.");
            return;
        }

        if (!code) {
            setError("No se recibió código de autorización.");
            return;
        }

        async function exchangeCode() {
            try {
                const response = await fetch("/api/auth/callback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error("Error al validar sesión");
                }

                router.push("/auth/redirect");
            } catch {
                setError("No se pudo completar el inicio de sesión.");
            }
        }

        exchangeCode();
    }, [router, searchParams]);

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            {!error ? (
                <>
                    <h1 className="text-2xl font-bold">Iniciando sesión...</h1>
                    <p className="mt-3 text-slate-400">
                        Estamos validando tu acceso a Excelandia LMS.
                    </p>
                </>
            ) : (
                <>
                    <h1 className="text-2xl font-bold text-red-400">Error</h1>
                    <p className="mt-3 text-slate-300">{error}</p>
                    <a
                        href="/"
                        className="mt-6 inline-block rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-slate-950"
                    >
                        Volver al inicio
                    </a>
                </>
            )}
        </div>
    );
}