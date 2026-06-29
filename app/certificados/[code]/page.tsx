import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import Link from "next/link";

interface Props {
    params: Promise<{
        code: string;
    }>;
}

export default async function CertificateVerificationPage({ params }: Props) {
    const { code } = await params;

    const certificates = await directus.request(
        readItems("course_certificates", {
            filter: {
                verification_code: {
                    _eq: code,
                },
            },
            fields: [
                "id",
                "certificate_number",
                "verification_code",
                "completed_at",
                "status",
                "student_id.first_name",
                "student_id.last_name",
                "course_id.title",
            ],
            limit: 1,
        })
    );

    const certificate: any = certificates[0];

    if (!certificate || certificate.status !== "issued") {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#02070F] px-6 text-white">
                <div className="max-w-xl rounded-3xl border border-red-500/30 bg-red-500/10 p-10 text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">
                        Certificado no válido
                    </p>

                    <h1 className="mt-4 text-4xl font-black">
                        No pudimos verificar este certificado
                    </h1>

                    <p className="mt-4 text-slate-300">
                        El código no existe o el certificado fue revocado.
                    </p>

                    <Link
                        href="/"
                        className="mt-8 inline-block rounded-2xl bg-slate-800 px-6 py-3 font-bold text-white transition hover:bg-slate-700"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </main>
        );
    }

    const studentName = `${certificate.student_id?.first_name ?? ""} ${certificate.student_id?.last_name ?? ""
        }`.trim();

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#02070F] text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#0f766e33,transparent_35%),radial-gradient(circle_at_bottom_right,#22c55e22,transparent_35%)]" />

            <section className="relative z-10 mx-auto flex min-h-screen max-w-5xl items-center px-6 py-12">
                <div className="w-full rounded-[2rem] border border-emerald-400/20 bg-slate-900/70 p-10 text-center shadow-[0_0_80px_rgba(16,185,129,0.12)] backdrop-blur">
                    <p className="text-sm font-bold uppercase tracking-[0.35em] text-emerald-400">
                        Certificado válido
                    </p>

                    <h1 className="mt-5 text-4xl font-black md:text-6xl">
                        Academia Excelandia
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                        Este certificado fue emitido oficialmente por Academia Excelandia.
                    </p>

                    <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-slate-800 bg-[#02070F]/70 p-8">
                        <p className="text-sm text-slate-500">
                            Se certifica que
                        </p>

                        <h2 className="mt-3 text-3xl font-black text-emerald-300 md:text-4xl">
                            {studentName || "Alumno"}
                        </h2>

                        <p className="mt-8 text-sm text-slate-500">
                            completó satisfactoriamente el curso
                        </p>

                        <h3 className="mt-3 text-2xl font-bold">
                            {certificate.course_id?.title ?? "Curso"}
                        </h3>

                        <div className="mt-8 grid gap-4 text-left md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                    Folio
                                </p>
                                <p className="mt-2 font-bold text-slate-200">
                                    {certificate.certificate_number}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                    Fecha
                                </p>
                                <p className="mt-2 font-bold text-slate-200">
                                    {certificate.completed_at
                                        ? new Date(certificate.completed_at).toLocaleDateString(
                                            "es-MX"
                                        )
                                        : "Sin fecha"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="mt-8 inline-block rounded-2xl bg-emerald-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-emerald-300"
                    >
                        Ir a Excelandia
                    </Link>
                </div>
            </section>
        </main>
    );
}