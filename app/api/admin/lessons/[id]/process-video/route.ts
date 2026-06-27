import { NextRequest, NextResponse } from "next/server";
import {
    CreateJobCommand,
} from "@aws-sdk/client-mediaconvert";
import { mediaConvert } from "@/lib/mediaconvert";
import { directus } from "@/lib/directus";
import {
    readItem,
    updateItem,
} from "@directus/sdk";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(
    request: NextRequest,
    { params }: Props
) {
    const { id } = await params;

    const lesson: any =
        await directus.request(
            readItem(
                "course_lessons",
                id,
                {
                    fields: [
                        "id",
                        "course_id",
                        "video_original_path",
                    ],
                }
            )
        );

    if (
        !lesson.video_original_path
    ) {
        return NextResponse.json(
            {
                error:
                    "La lección no tiene video.",
            },
            {
                status: 400,
            }
        );
    }

    const outputPath =
        `courses/${lesson.course_id}/lessons/${id}/`;

    const command =
        new CreateJobCommand({
            Role:
                process.env
                    .MEDIACONVERT_ROLE_ARN,

            Settings: {
                Inputs: [
                    {
                        FileInput:
                            `s3://${process.env.S3_ORIGINAL_BUCKET}/${lesson.video_original_path}`,
                    },
                ],

                OutputGroups: [
                    {
                        Name:
                            "Apple HLS",

                        OutputGroupSettings:
                        {
                            Type:
                                "HLS_GROUP_SETTINGS",

                            HlsGroupSettings:
                            {
                                Destination:
                                    `s3://${process.env.S3_STREAMING_BUCKET}/${outputPath}`,
                            },
                        },

                        Outputs: [
                            {
                                ContainerSettings:
                                {
                                    Container:
                                        "M3U8",
                                },

                                VideoDescription:
                                {
                                    Width: 1280,
                                    Height: 720,
                                    CodecSettings:
                                    {
                                        Codec:
                                            "H_264",
                                        H264Settings:
                                        {
                                            Bitrate:
                                                3500000,
                                        },
                                    },
                                },

                                NameModifier:
                                    "_720p",
                            },
                        ],
                    },
                ],
            },
        });

    const result =
        await mediaConvert.send(
            command
        );

    await directus.request(
        updateItem(
            "course_lessons",
            id,
            {
                video_status:
                    "processing",
                video_job_id:
                    result.Job?.Id,
            }
        )
    );

    return NextResponse.json({
        jobId:
            result.Job?.Id,
    });
}