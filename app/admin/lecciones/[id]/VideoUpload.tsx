"use client";

import { useState } from "react";

interface Props {
    lessonId: string;
    courseId: string;
}

export default function VideoUpload({
    lessonId,
    courseId,
}: Props) {
    const [uploading, setUploading] = useState(false);
    const [progressText, setProgressText] = useState("");

    async function handleUpload(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const form = event.currentTarget;

        const file =
            (form.elements.namedItem(
                "video"
            ) as HTMLInputElement)?.files?.[0];

        if (!file) {
            alert("Selecciona un video.");
            return;
        }

        if (file.type !== "video/mp4") {
            alert("Solo se permiten archivos MP4.");
            return;
        }

        setUploading(true);

        try {
            setProgressText("Generando URL de subida...");

            const response = await fetch(
                `/api/admin/lessons/${lessonId}/upload-url`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        courseId,
                        fileName: file.name,
                        contentType: file.type,
                        fileSize: file.size,
                    }),
                }
            );

            if (!response.ok) {
                const text = await response.text();

                console.error(
                    "Error generando URL:",
                    text
                );

                alert(
                    "No se pudo generar la URL de subida."
                );

                setUploading(false);
                setProgressText("");

                return;
            }

            const data = await response.json();

            if (!data.uploadUrl) {
                console.error(data);

                alert(
                    "La API no devolvió una URL válida."
                );

                setUploading(false);
                setProgressText("");

                return;
            }

            setProgressText("Subiendo video a S3...");

            const uploadResponse = await fetch(
                data.uploadUrl,
                {
                    method: "PUT",
                    body: file,
                    headers: {
                        "Content-Type": file.type,
                    },
                }
            );

            if (!uploadResponse.ok) {
                const text =
                    await uploadResponse.text();

                console.error(
                    "Error al subir a S3:",
                    text
                );

                alert(
                    `No se pudo subir el video a S3.\n\nEstado: ${uploadResponse.status}`
                );

                setUploading(false);
                setProgressText("");

                return;
            }

            setProgressText(
                "Video cargado correctamente."
            );

            alert(
                "Video cargado correctamente."
            );

            location.reload();
        } catch (error) {
            console.error(error);

            alert(
                "Ocurrió un error durante la subida."
            );
        }

        setUploading(false);
        setProgressText("");
    }

    return (
        <form
            onSubmit={handleUpload}
            className="mt-6 grid gap-4"
        >
            <input
                type="file"
                name="video"
                accept="video/mp4"
                disabled={uploading}
                required
                className="rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3 text-slate-300"
            />

            <button
                type="submit"
                disabled={uploading}
                className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {uploading
                    ? "Subiendo..."
                    : "Subir video MP4"}
            </button>

            {progressText && (
                <p className="text-sm text-slate-400">
                    {progressText}
                </p>
            )}
        </form>
    );
}