"use client";

import Hls from "hls.js";
import {
    useEffect,
    useRef,
    useState,
} from "react";

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
    const [initialPosition, setInitialPosition] =
        useState(0);

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

                if (
                    data.progress?.last_position
                ) {
                    setInitialPosition(
                        Number(
                            data.progress.last_position
                        )
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
        const video = videoRef.current;

        if (!video) {
            return;
        }

        let lastSave = 0;
        let completed = false;

        const saveProgress = async () => {
            const current = Math.floor(video.currentTime);

            try {
                const response = await fetch(
                    `/api/lessons/${lessonId}/progress`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            course_id: courseId,
                            last_position: current,
                            watched_seconds: current,
                            duration: Math.floor(video.duration),
                        }),
                    }
                );

                const data = await response.json();

                if (data.completed) {
                    completed = true;
                }
            } catch (error) {
                console.error(error);
            }
        };

        const handleTimeUpdate = async () => {
            const current = Math.floor(video.currentTime);

            if (completed) {
                return;
            }

            if (current - lastSave < 10) {
                return;
            }

            lastSave = current;

            await saveProgress();
        };

        const handleEnded = async () => {
            await saveProgress();
        };

        const handlePageLeave = async () => {
            await saveProgress();
        };

        video.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        video.addEventListener(
            "ended",
            handleEnded
        );

        window.addEventListener(
            "beforeunload",
            handlePageLeave
        );

        return () => {
            video.removeEventListener(
                "timeupdate",
                handleTimeUpdate
            );

            video.removeEventListener(
                "ended",
                handleEnded
            );

            window.removeEventListener(
                "beforeunload",
                handlePageLeave
            );
        };
    }, [lessonId, courseId]);

    //
    // Guardar progreso cada 10 segundos
    //
    useEffect(() => {
        const video = videoRef.current;

        if (!video) {
            return;
        }

        let lastSave = 0;

        const handleTimeUpdate =
            async () => {
                const current =
                    Math.floor(
                        video.currentTime
                    );

                if (
                    current - lastSave <
                    10
                ) {
                    return;
                }

                lastSave = current;

                try {
                    await fetch(
                        `/api/lessons/${lessonId}/progress`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json",
                            },
                            body: JSON.stringify({
                                course_id:
                                    courseId,
                                last_position:
                                    current,
                                watched_seconds:
                                    current,
                                duration:
                                    Math.floor(
                                        video.duration
                                    ),
                            }),
                        }
                    );
                } catch (error) {
                    console.error(error);
                }
            };

        video.addEventListener(
            "timeupdate",
            handleTimeUpdate
        );

        return () => {
            video.removeEventListener(
                "timeupdate",
                handleTimeUpdate
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