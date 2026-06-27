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
    const [uploading, setUploading] =
        useState(false);

    async function handleUpload(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const form =
            event.currentTarget;

        const file =
            (form.video as HTMLInputElement)
                .files?.[0];

        if (!file) return;

        setUploading(true);

        try {
            const response =
                await fetch(
                    `/api/admin/lessons/${lessonId}/upload-url`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
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
                console.error("Upload URL error:", text);
                alert("No se pudo generar la URL de subida.");
                return;
            }

            const { uploadUrl } = await response.json();

            if (!uploadUrl) {
                alert("La API no devolvió uploadUrl.");
                return;
            }

            await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type":
                        file.type,
                },
            });

            alert(
                "Video cargado correctamente."
            );

            location.reload();
        } catch (error) {
            console.error(error);

            alert(
                "No se pudo subir el video."
            );
        }

        setUploading(false);
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
                required
                className="rounded-2xl border border-slate-700 bg-[#02070F] px-4 py-3"
            />

            <button
                disabled={uploading}
                className="rounded-2xl bg-emerald-400 px-6 py-3 font-bold text-slate-950"
            >
                {uploading
                    ? "Subiendo..."
                    : "Subir video MP4"}
            </button>
        </form>
    );
}