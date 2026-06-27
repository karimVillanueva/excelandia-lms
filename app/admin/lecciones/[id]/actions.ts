"use server";

import { directus } from "@/lib/directus";
import { createItem, deleteItem, updateItem, uploadFiles } from "@directus/sdk";
import { revalidatePath } from "next/cache";

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