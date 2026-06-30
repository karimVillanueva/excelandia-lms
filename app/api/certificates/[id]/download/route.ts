import { NextRequest, NextResponse } from "next/server";
import { readItem } from "@directus/sdk";
import { directus } from "@/lib/directus";
import { verifyToken } from "@/lib/cognito";

interface Props {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
    try {
        const token = request.cookies.get("id_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await verifyToken(token);

        const { id } = await params;

        const certificate: any = await directus.request(
            readItem("course_certificates", id, {
                fields: [
                    "id",
                    "certificate_number",
                    "pdf_file.id",
                    "pdf_file.filename_download",
                ],
            })
        );

        if (!certificate?.pdf_file?.id) {
            return NextResponse.json(
                { error: "Certificate PDF not found" },
                { status: 404 }
            );
        }

        const directusUrl = process.env.DIRECTUS_URL;
        const directusToken = process.env.DIRECTUS_TOKEN;

        const fileResponse = await fetch(
            `${directusUrl}/assets/${certificate.pdf_file.id}`,
            {
                headers: {
                    Authorization: `Bearer ${directusToken}`,
                },
            }
        );

        if (!fileResponse.ok) {
            return NextResponse.json(
                { error: "Could not download certificate file" },
                { status: fileResponse.status }
            );
        }

        const fileBuffer = await fileResponse.arrayBuffer();

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${certificate.pdf_file.filename_download ?? `certificado-${certificate.certificate_number}.pdf`}"`,
            },
        });
    } catch (error) {
        console.error("Download certificate error:", error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error" },
            { status: 500 }
        );
    }
}