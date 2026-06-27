import { NextRequest, NextResponse } from "next/server";
import { CreateJobCommand } from "@aws-sdk/client-mediaconvert";
import { mediaConvert } from "@/lib/mediaconvert";
import { directus } from "@/lib/directus";
import { readItem, updateItem } from "@directus/sdk";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export async function POST(request: NextRequest, { params }: Props) {
    try {
        const { id } = await params;

        const lesson: any = await directus.request(
            readItem("course_lessons", id, {
                fields: ["id", "course_id", "video_original_path"],
            })
        );

        if (!lesson.video_original_path) {
            return NextResponse.json(
                { error: "La lección no tiene video original." },
                { status: 400 }
            );
        }

        const outputPath = `courses/${lesson.course_id}/lessons/${id}/`;

        const result = await mediaConvert.send(
            new CreateJobCommand({
                Role: process.env.MEDIACONVERT_ROLE_ARN!,

                Settings: {
                    Inputs: [
                        {
                            FileInput: `s3://${process.env.S3_ORIGINAL_BUCKET}/${lesson.video_original_path}`,
                            AudioSelectors: {
                                "Audio Selector 1": {
                                    DefaultSelection: "DEFAULT",
                                },
                            },
                            VideoSelector: {},
                        },
                    ],

                    OutputGroups: [
                        {
                            Name: "HLS",

                            OutputGroupSettings: {
                                Type: "HLS_GROUP_SETTINGS",
                                HlsGroupSettings: {
                                    Destination: `s3://${process.env.S3_STREAMING_BUCKET}/${outputPath}`,
                                    SegmentLength: 6,
                                    MinSegmentLength: 0,
                                },
                            },

                            Outputs: [
                                {
                                    NameModifier: "_720p",

                                    ContainerSettings: {
                                        Container: "M3U8",
                                        M3u8Settings: {},
                                    },

                                    VideoDescription: {
                                        Width: 1280,
                                        Height: 720,
                                        CodecSettings: {
                                            Codec: "H_264",
                                            H264Settings: {
                                                RateControlMode: "CBR",
                                                Bitrate: 3500000,
                                                CodecProfile: "MAIN",
                                                CodecLevel: "AUTO",
                                                GopSize: 2,
                                                GopSizeUnits: "SECONDS",
                                                NumberBFramesBetweenReferenceFrames: 2,
                                            },
                                        },
                                    },

                                    AudioDescriptions: [
                                        {
                                            AudioSourceName: "Audio Selector 1",
                                            CodecSettings: {
                                                Codec: "AAC",
                                                AacSettings: {
                                                    Bitrate: 96000,
                                                    CodingMode: "CODING_MODE_2_0",
                                                    SampleRate: 48000,
                                                },
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            })
        );

        await directus.request(
            updateItem("course_lessons", id, {
                video_status: "processing",
                video_job_id: result.Job?.Id,
            })
        );

        return NextResponse.json({
            success: true,
            jobId: result.Job?.Id,
            outputPath,
        });
    } catch (error: any) {
        console.error("MediaConvert error:", error);

        return NextResponse.json(
            {
                error: error?.message ?? "Error desconocido",
                name: error?.name,
                metadata: error?.$metadata,
            },
            { status: 500 }
        );
    }
}