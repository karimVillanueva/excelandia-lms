import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { directus } from "@/lib/directus";
import { verifyToken } from "@/lib/cognito";
import { createItem, readItems, uploadFiles } from "@directus/sdk";

interface Props {
    params: Promise<{ id: string }>;
}

async function getCurrentStudent(request: NextRequest) {
    const token = request.cookies.get("id_token")?.value;

    if (!token) throw new Error("Unauthorized");

    const payload = await verifyToken(token);
    const email = payload.email as string;
    const cognitoSub = payload.sub as string;

    const accounts = await directus.request(
        readItems("student_accounts", {
            filter: {
                _or: [
                    { cognito_sub: { _eq: cognitoSub } },
                    { email: { _eq: email } },
                ],
            },
            limit: 1,
        })
    );

    const account = accounts[0];
    if (!account) throw new Error("Account not found");

    const students = await directus.request(
        readItems("students", {
            filter: {
                account_id: { _eq: account.id },
            },
            limit: 1,
        })
    );

    const student = students[0];
    if (!student) throw new Error("Student not found");

    return { account, student };
}

function makeCertificateNumber() {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).slice(2, 8).toUpperCase();

    return `EXC-${year}-${random}`;
}

function makeVerificationCode() {
    return crypto.randomUUID();
}

async function generateCertificatePdf({
    studentName,
    courseTitle,
    certificateNumber,
    completedAt,
}: {
    studentName: string;
    courseTitle: string;
    certificateNumber: string;
    completedAt: string;
}) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText("ACADEMIA EXCELANDIA", {
        x: 250,
        y: 500,
        size: 24,
        font: bold,
        color: rgb(0.2, 0.9, 0.65),
    });

    page.drawText("Certificado de finalización", {
        x: 260,
        y: 455,
        size: 22,
        font: bold,
        color: rgb(1, 1, 1),
    });

    page.drawText("Se otorga el presente reconocimiento a:", {
        x: 285,
        y: 400,
        size: 14,
        font,
        color: rgb(0.75, 0.78, 0.85),
    });

    page.drawText(studentName, {
        x: 220,
        y: 355,
        size: 30,
        font: bold,
        color: rgb(1, 1, 1),
    });

    page.drawText("Por haber completado satisfactoriamente el curso:", {
        x: 245,
        y: 310,
        size: 14,
        font,
        color: rgb(0.75, 0.78, 0.85),
    });

    page.drawText(courseTitle, {
        x: 280,
        y: 265,
        size: 26,
        font: bold,
        color: rgb(0.2, 0.9, 0.65),
    });

    page.drawText(`Fecha: ${new Date(completedAt).toLocaleDateString("es-MX")}`, {
        x: 90,
        y: 120,
        size: 12,
        font,
        color: rgb(0.75, 0.78, 0.85),
    });

    page.drawText(`Folio: ${certificateNumber}`, {
        x: 90,
        y: 95,
        size: 12,
        font,
        color: rgb(0.75, 0.78, 0.85),
    });

    return pdfDoc.save();
}

export async function POST(request: NextRequest, { params }: Props) {
    try {
        const { id: courseId } = await params;
        const { student } = await getCurrentStudent(request);

        const courses = await directus.request(
            readItems("courses", {
                filter: { id: { _eq: courseId } },
                fields: [
                    "id",
                    "title",
                    "generate_certificate",
                    "minimum_completion_percent",
                ],
                limit: 1,
            })
        );

        const course: any = courses[0];

        if (!course) {
            return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
        }

        if (!course.generate_certificate) {
            return NextResponse.json(
                { error: "Este curso no emite certificado" },
                { status: 400 }
            );
        }

        const lessons = await directus.request(
            readItems("course_lessons", {
                filter: {
                    course_id: { _eq: courseId },
                    status: { _eq: "published" },
                },
                fields: ["id"],
                limit: -1,
            })
        );

        if (lessons.length === 0) {
            return NextResponse.json(
                { error: "El curso no tiene lecciones publicadas" },
                { status: 400 }
            );
        }

        const progress = await directus.request(
            readItems("Lesson_Progress", {
                filter: {
                    student_id: { _eq: student.id },
                    lesson_id: {
                        _in: lessons.map((lesson: any) => lesson.id),
                    },
                    completed: { _eq: true },
                },
                fields: ["id"],
                limit: -1,
            })
        );

        const completionPercent = Math.round((progress.length / lessons.length) * 100);
        const requiredPercent = course.minimum_completion_percent ?? 100;

        if (completionPercent < requiredPercent) {
            return NextResponse.json(
                {
                    error: "Aún no cumples el progreso requerido",
                    completionPercent,
                    requiredPercent,
                },
                { status: 403 }
            );
        }

        const existing = await directus.request(
            readItems("course_certificates", {
                filter: {
                    student_id: { _eq: student.id },
                    course_id: { _eq: courseId },
                    status: { _eq: "issued" },
                },
                fields: ["id", "certificate_number", "verification_code"],
                limit: 1,
            })
        );

        if (existing[0]) {
            return NextResponse.json({
                success: true,
                certificate: existing[0],
                alreadyIssued: true,
            });
        }

        const completedAt = new Date().toISOString();
        const certificateNumber = makeCertificateNumber();
        const verificationCode = makeVerificationCode();

        const pdfBytes = await generateCertificatePdf({
            studentName: `${student.first_name} ${student.last_name}`,
            courseTitle: course.title,
            certificateNumber,
            completedAt,
        });

        const fileForm = new FormData();

        const pdfArrayBuffer = pdfBytes.buffer.slice(
            pdfBytes.byteOffset,
            pdfBytes.byteOffset + pdfBytes.byteLength
        ) as ArrayBuffer;

        const pdfBlob = new Blob([pdfArrayBuffer], {
            type: "application/pdf",
        });

        fileForm.append(
            "file",
            pdfBlob,
            `certificado-${certificateNumber}.pdf`
        );

        const uploadedFile: any = await directus.request(uploadFiles(fileForm));

        const fileId = Array.isArray(uploadedFile)
            ? uploadedFile[0].id
            : uploadedFile.id;

        const certificate = await directus.request(
            createItem("course_certificates", {
                student_id: student.id,
                course_id: courseId,
                certificate_number: certificateNumber,
                verification_code: verificationCode,
                completed_at: completedAt,
                pdf_file: fileId,
                status: "issued",
            })
        );

        return NextResponse.json({
            success: true,
            certificate,
        });
    } catch (error) {
        console.error("Certificate error:", error);

        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error" },
            { status: 500 }
        );
    }
}