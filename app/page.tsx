import { getLoginUrl } from "@/lib/auth-url";

export default function HomePage() {
  const storeUrl =
    process.env.NEXT_PUBLIC_STORE_URL || "https://www.excelandia.com/tienda";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_30%)]" />

      <div className="absolute left-10 top-24 h-24 w-24 animate-bounce rounded-3xl border border-emerald-400/20 bg-emerald-400/10 blur-sm" />
      <div className="absolute bottom-24 right-16 h-32 w-32 animate-pulse rounded-full border border-cyan-400/20 bg-cyan-400/10 blur-sm" />
      <div className="absolute right-1/4 top-20 h-3 w-3 animate-ping rounded-full bg-emerald-400" />
      <div className="absolute bottom-1/3 left-1/4 h-2 w-2 animate-ping rounded-full bg-cyan-300" />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a
          href="/"
          className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400 transition hover:scale-105 hover:text-emerald-300"
        >
          Excelandia LMS
        </a>

        <a
          href={storeUrl}
          className="rounded-full border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:text-white"
        >
          Comprar acceso
        </a>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl flex-col items-center justify-center px-6 pb-20 text-center">
        <div className="mb-5 inline-flex animate-pulse items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Plataforma de aprendizaje activa
        </div>

        <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
          Entra a tus materiales y cursos de{" "}
          <span className="bg-gradient-to-r from-emerald-300 via-cyan-200 to-emerald-400 bg-clip-text text-transparent">
            Excelandia
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
          Usa el correo con el que realizaste tu compra. Si todavía no tienes
          acceso, compra un material en la tienda de Excelandia.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href={getLoginUrl()}
            className="group rounded-2xl bg-emerald-400 px-9 py-4 font-bold text-slate-950 shadow-[0_0_30px_rgba(52,211,153,0.25)] transition hover:-translate-y-1 hover:scale-105 hover:bg-emerald-300 hover:shadow-[0_0_50px_rgba(52,211,153,0.45)]"
          >
            Iniciar sesión
            <span className="ml-2 inline-block transition group-hover:translate-x-1">
              →
            </span>
          </a>

          <a
            href={storeUrl}
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-9 py-4 font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:scale-105 hover:border-emerald-400 hover:bg-slate-800"
          >
            Comprar acceso
          </a>
        </div>

        <div className="mt-10 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60 hover:text-slate-200">
            Acceso anual
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60 hover:text-slate-200">
            Materiales digitales
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-4 py-3 backdrop-blur transition hover:-translate-y-1 hover:border-emerald-400/60 hover:text-slate-200">
            Recuperación segura
          </div>
        </div>

        <p className="mt-8 max-w-xl text-sm text-slate-500">
          Para restablecer contraseña, entra a “Iniciar sesión” y usa la opción
          de recuperación de la plataforma.
        </p>
      </section>
    </main>
  );
}