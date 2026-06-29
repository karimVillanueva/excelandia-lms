"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

interface Props {
    lessonId: string;
    courseId: string;
    src: string;
}

export default function HlsPlayer({
    lessonId,
    courseId,
    src,
}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [initialPosition, setInitialPosition] = useState(0);

    //
    // Cargar progreso guardado
    //
    useEffect(() => {
        async function loadProgress() {
            try {
                const response = await fetch(
                    `/api/lessons/${lessonId}/progress`
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (data.progress?.last_position) {
                    setInitialPosition(
                        Number(data.progress.last_position)
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }

        loadProgress();
    }, [lessonId]);

    //
    // Inicializar HLS
    //
    useEffect(() => {
        const element = videoRef.current;

        if (!element) {
            return;
        }

        let hls: Hls | undefined;

        element.src = "";

        if (
            element.canPlayType(
                "application/vnd.apple.mpegurl"
            )
        ) {
            element.src = src;
        } else if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
            });

            hls.loadSource(src);
            hls.attachMedia(element);

            hls.on(
                Hls.Events.ERROR,
                (_, data) => {
                    console.error("HLS error:", data);
                }
            );
        } else {
            console.error(
                "HLS no soportado en este navegador"
            );
        }

        function handleLoadedMetadata() {
            if (
                initialPosition > 0 &&
                initialPosition < element.duration
            ) {
                element.currentTime = initialPosition;
            }
        }

        element.addEventListener(
            "loadedmetadata",
            handleLoadedMetadata
        );

        return () => {
            element.removeEventListener(
                "loadedmetadata",
                handleLoadedMetadata
            );

            hls?.destroy();
        };
    }, [src, initialPosition]);

    //
    // Guardar progreso
    //
    useEffect(() => {
        const element = videoRef.current;

        if (!element) {
            return;
        }

        let lastSave = 0;
        let completed = false;

        async function saveProgress() {
            const current = Math.floor(
                element.currentTime
            );

            const duration = Math.floor(
                element.duration || 0
            );

            if (
                !duration ||
                Number.isNaN(duration)
            ) {
                return;
            }

            try {
                const response = await fetch(
                    `/api/lessons/${lessonId}/progress`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            course_id: courseId,
                            last_position: current,
                            watched_seconds: current,
                            duration,
                        }),
                    }
                );

                if (!response.ok) {
                    return;
                }

                const data =
                    await response.json();

                if (data.completed) {
                    completed = true;
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function handleTimeUpdate() {
            const current = Math.floor(
                element.currentTime
            );

            if (completed) {
                return;
            }

            if (
                current - lastSave <
                10
            ) {
                return;
            }

            lastSave = current;

            await saveProgress();
        }

        async function handleEnded() {
            await saveProgress();
        }

        function handlePageLeave() {
            void saveProgress();
        }

        element.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        element.addEventListener(
            "ended",
            handleEnded
        );

        window.addEventListener(
            "beforeunload",
            handlePageLeave
        );

        return () => {
            element.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            element.removeEventListener(
                "ended",
                handleEnded
            );

            window.removeEventListener(
                "beforeunload",
                handlePageLeave
            );
        };
    }, [lessonId, courseId]);

    return (
        <video
            ref={videoRef}
            controls
            className="aspect-video w-full rounded-3xl bg-black"
        />
    );
}