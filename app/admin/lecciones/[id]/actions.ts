"use server";

import { directus } from "@/lib/directus";
import { createItem, deleteItem, updateItem, uploadFiles } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

export async function updateLesson(lessonId: string, formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "draft");
    const isPreview = formData.get("is_preview") === "on";

    await directus.request(
        updateItem("course_lessons", lessonId, {
            title,
            description,
            status,
            is_preview: isPreview,
        })
    );

    revalidatePath(`/admin/lecciones/${lessonId}`);
}

export async function uploadLessonMaterial(
    lessonId: string,
    courseId: string,
    formData: FormData
) {
    const title = String(formData.get("title") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const fileType = String(formData.get("file_type") || "other");
    const isDownloadable = formData.get("is_downloadable") === "on";
    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
        throw new Error("Debes seleccionar un archivo");
    }

    const uploadForm = new FormData();
    uploadForm.append("file", file);

    const uploadedFile: any = await directus.request(uploadFiles(uploadForm));

    const fileId = Array.isArray(uploadedFile)
        ? uploadedFile[0].id
        : uploadedFile.id;

    await directus.request(
        createItem("lesson_materials", {
            lesson_id_: lessonId,
            course_id: courseId,
            title: title || file.name,
            description: description || null,
            file: fileId,
            file_type: fileType,
            is_downloadable: isDownloadable,
            status: "published",
        })
    );

    revalidatePath(`/admin/lecciones/${lessonId}`);
}

export async function deleteLessonMaterial(
    lessonId: string,
    materialId: string
) {
    await directus.request(deleteItem("lesson_materials", materialId));

    revalidatePath(`/admin/lecciones/${lessonId}`);
}

export async function uploadLessonVideo(
    lessonId: string,
    courseId: string,
    formData: FormData
) {
    const file = formData.get("video") as File | null;

    if (!file || file.size === 0) {
        throw new Error("Debes seleccionar un video");
    }

    if (file.type !== "video/mp4") {
        throw new Error("Solo se permiten videos MP4");
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const key = `courses/${courseId}/lessons/${lessonId}/original.mp4`;

    await s3.send(
        new PutObjectCommand({
            Bucket: process.env.S3_ORIGINAL_BUCKET!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
        })
    );

    await directus.request(
        updateItem("course_lessons", lessonId, {
            video_original_path: key,
            video_status: "uploaded",
            video_size_mb: Number((file.size / 1024 / 1024).toFixed(2)),
        })
    );

    revalidatePath(`/admin/lecciones/${lessonId}`);
}