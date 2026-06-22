// src/app/page.tsx

import { getLoginUrl } from "@/lib/auth-url";

export default function HomePage() {
  const storeUrl =
    process.env.NEXT_PUBLIC_STORE_URL || "https://www.excelandia.com/#tienda";

  return (
    <main className="min-h-screen bg-[#02070F] text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
          Excelandia LMS
        </p>

        <h1 className="max-w-3xl text-4xl font-bold md:text-6xl">
          Entra a tus materiales y cursos de Excelandia
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Usa el correo con el que realizaste tu compra. Si todavía no tienes
          acceso, compra un material en la tienda de Excelandia.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href={getLoginUrl()}
            className="rounded-xl bg-emerald-400 px-8 py-3 font-semibold text-slate-950 hover:bg-emerald-300"
          >
            Iniciar sesión
          </a>

          <a
            href={storeUrl}
            className="rounded-xl border border-slate-700 px-8 py-3 font-semibold hover:bg-slate-900"
          >
            Comprar acceso
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Para restablecer contraseña, entra a “Iniciar sesión” y usa la opción
          de recuperación de Cognito.
        </p>
      </section>
    </main>
  );
}