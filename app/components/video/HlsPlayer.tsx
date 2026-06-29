"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

interface Props {
    lessonId: string;
    courseId: string;
    src: string;
}

export default function HlsPlayer({ lessonId, courseId, src }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [initialPosition, setInitialPosition] = useState(0);

    // 1. Cargar progreso guardado
    useEffect(() => {
        async function loadProgress() {
            try {
                const response = await fetch(`/api/lessons/${lessonId}/progress`);

                if (!response.ok) return;

                const data = await response.json();

                if (data.progress?.last_position) {
                    setInitialPosition(Number(data.progress.last_position));
                }
            } catch (error) {
                console.error(error);
            }
        }

        loadProgress();
    }, [lessonId]);

    // 2. Inicializar HLS
    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        let hls: Hls | undefined;

        video.src = "";

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
        } else if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, (_, data) => {
                console.error("HLS error:", data);
            });
        } else {
            console.error("HLS no soportado en este navegador");
        }

        const handleLoadedMetadata = () => {
            if (initialPosition > 0 && initialPosition < video.duration) {
                video.currentTime = initialPosition;
            }
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            hls?.destroy();
        };
    }, [src, initialPosition]);

    // 3. Guardar progreso
    // 3. Guardar progreso
    useEffect(() => {
        const currentVideo = videoRef.current;

        if (!currentVideo) return;

        let lastSave = 0;
        let completed = false;

        async function saveProgress() {
            const current = Math.floor(currentVideo.currentTime);
            const duration = Math.floor(currentVideo.duration || 0);

            if (!duration || Number.isNaN(duration)) return;

            try {
                const response = await fetch(`/api/lessons/${lessonId}/progress`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        course_id: courseId,
                        last_position: current,
                        watched_seconds: current,
                        duration,
                    }),
                });

                if (!response.ok) return;

                const data = await response.json();

                if (data.completed) {
                    completed = true;
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function handleTimeUpdate() {
            const current = Math.floor(currentVideo.currentTime);

            if (completed) return;
            if (current - lastSave < 10) return;

            lastSave = current;
            await saveProgress();
        }

        async function handleEnded() {
            await saveProgress();
        }

        function handlePageLeave() {
            saveProgress();
        }

        currentVideo.addEventListener("timeupdate", handleTimeUpdate);
        currentVideo.addEventListener("ended", handleEnded);
        window.addEventListener("beforeunload", handlePageLeave);

        return () => {
            currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
            currentVideo.removeEventListener("ended", handleEnded);
            window.removeEventListener("beforeunload", handlePageLeave);
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