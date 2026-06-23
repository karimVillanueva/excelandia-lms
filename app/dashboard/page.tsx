"use client";

import { useMe } from "@/hooks/useMe";

export default function DashboardPage() {
    const { me, loading } = useMe();

    if (loading) {
        return (
            <div className="p-10">
                Cargando...
            </div>
        );
    }

    return (
        <main className="max-w-6xl mx-auto p-10">
            <h1 className="text-4xl font-bold mb-2">
                Bienvenido
            </h1>

            <p className="text-slate-500 mb-8">
                {me?.student
                    ? `${me.student.first_name} ${me.student.last_name}`
                    : me?.email}
            </p>

            <div className="border rounded-xl p-6 mb-8">
                <h2 className="font-semibold mb-2">
                    Estado de la cuenta
                </h2>

                <p>{me?.account?.status}</p>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">
                    Mis cursos
                </h2>

                {me?.enrollments.length === 0 ? (
                    <div className="border rounded-xl p-6">
                        Todavía no tienes cursos activos.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {me.enrollments.map((enrollment) => (
                            <div
                                key={enrollment.id}
                                className="border rounded-xl p-6"
                            >
                                <h3 className="font-semibold">
                                    {enrollment.course_id.title}
                                </h3>

                                <p className="text-sm text-slate-500 mt-2">
                                    Estado: {enrollment.status}
                                </p>

                                <p className="text-sm text-slate-500">
                                    Vigencia:
                                </p>

                                <p className="text-sm">
                                    {new Date(
                                        enrollment.starts_at
                                    ).toLocaleDateString()}
                                </p>

                                <p className="text-sm">
                                    {new Date(
                                        enrollment.ends_at
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}