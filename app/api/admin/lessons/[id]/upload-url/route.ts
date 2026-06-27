import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";
import { directus } from "@/lib/directus";
import { updateItem } from "@directus/sdk";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: NextRequest,
    { params }: Props
) {
    try {
        const { id } = await params;

        const body = await request.json();

        const {
            courseId,
            fileName,
            contentType,
            fileSize,
        } = body;

        const key =
            `courses/${courseId}/lessons/${id}/original.mp4`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_ORIGINAL_BUCKET!,
            Key: key,
            ContentType: contentType,
        });

        const uploadUrl = await getSignedUrl(
            s3,
            command,
            {
                expiresIn: 900,
            }
        );

        await directus.request(
            updateItem("course_lessons", id, {
                video_original_path: key,
                video_status: "uploading",
                video_size_mb: Math.round(fileSize / 1024 / 1024),
            })
        );

        return NextResponse.json({
            uploadUrl,
            key,
        });
    } catch (error) {
        console.error(error);


        return NextResponse.json(
            {
                error: "No se pudo generar la URL.",
            },
            {
                status: 500,
            }
        );
    }
}