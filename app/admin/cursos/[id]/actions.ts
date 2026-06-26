"use server";

import { directus } from "@/lib/directus";
import { updateItem, uploadFiles } from "@directus/sdk";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export async function updateCourse(courseId: string, formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const slugInput = String(formData.get("slug") || "").trim();
    const courseCode = String(formData.get("course_code") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "draft");
    const thumbnail = formData.get("thumbnail") as File | null;

    if (!title) {
        throw new Error("El título es obligatorio");
    }

    let thumbnailId: string | undefined;

    if (thumbnail && thumbnail.size > 0) {
        const uploadForm = new FormData();
        uploadForm.append("file", thumbnail);

        const uploadedFile: any = await directus.request(uploadFiles(uploadForm));

        thumbnailId = Array.isArray(uploadedFile)
            ? uploadedFile[0].id
            : uploadedFile.id;
    }

    await directus.request(
        updateItem("courses", courseId, {
            title,
            slug: slugInput ? slugify(slugInput) : slugify(title),
            course_code: courseCode || null,
            description: description || null,
            status,
            ...(thumbnailId ? { thumbnail: thumbnailId } : {}),
        })
    );

    revalidatePath(`/admin/cursos/${courseId}`);
    revalidatePath("/admin/cursos");
    revalidatePath("/admin");
}