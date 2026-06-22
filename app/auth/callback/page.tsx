// app/auth/callback/page.tsx

import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function AuthCallbackPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#02070F] text-white">
            <Suspense
                fallback={
                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
                        <h1 className="text-2xl font-bold">Cargando...</h1>
                        <p className="mt-3 text-slate-400">Preparando autenticación.</p>
                    </div>
                }
            >
                <AuthCallbackClient />
            </Suspense>
        </main>
    );
}