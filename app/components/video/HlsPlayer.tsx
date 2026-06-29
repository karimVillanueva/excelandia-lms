"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

interface Props {
    src: string;
}

export default function HlsPlayer({ src }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;

        if (!video) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            return;
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);

            return () => {
                hls.destroy();
            };
        }
    }, [src]);

    return (
        <video
            ref={videoRef}
            controls
            className="aspect-video w-full rounded-3xl bg-black"
        />
    );
}