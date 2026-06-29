import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { directus } from "@/lib/directus";
import { s3 } from "@/lib/s3";
import { readItem } from "@directus/sdk";

interface Props {
    params: Promise<{ id: string }>;
}

async function streamToString(stream: any) {
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString("utf-8");
}

function getBasePath(key: string) {
    return key.split("/").slice(0, -1).join("/");
}

export async function GET(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;
        const searchParams = request.nextUrl.searchParams;

        const lesson: any = await directus.request(
            readItem("course_lessons", id, {
                fields: ["id", "video_hls_path", "video_status"],
            })
        );

        if (!lesson.video_hls_path || lesson.video_status !== "ready") {
            return NextResponse.json(
                { error: "El video no está disponible." },
                { status: 404 }
            );
        }

        const key = searchParams.get("key") || lesson.video_hls_path;
        const basePath = getBasePath(key);

        const object = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.S3_STREAMING_BUCKET!,
                Key: key,
            })
        );

        const playlist = await streamToString(object.Body);

        const rewritten = await Promise.all(
            playlist.split("\n").map(async (line) => {
                const trimmed = line.trim();

                if (!trimmed || trimmed.startsWith("#")) {
                    return line;
                }

                const childKey = `${basePath}/${trimmed}`;

                if (trimmed.endsWith(".m3u8")) {
                    return `/api/lessons/${id}/hls?key=${encodeURIComponent(childKey)}`;
                }

                const signedUrl = await getSignedUrl(
                    s3,
                    new GetObjectCommand({
                        Bucket: process.env.S3_STREAMING_BUCKET!,
                        Key: childKey,
                    }),
                    { expiresIn: 3600 }
                );

                return signedUrl;
            })
        );

        return new NextResponse(rewritten.join("\n"), {
            headers: {
                "Content-Type": "application/vnd.apple.mpegurl",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("HLS error:", error);

        return NextResponse.json(
            { error: "No se pudo cargar el video." },
            { status: 500 }
        );
    }
}