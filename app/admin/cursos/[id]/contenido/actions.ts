"use server";

import { directus } from "@/lib/directus";
import { createItem, deleteItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";

export async function createModule(courseId: string, formData: FormData) {
    const title = String(formData.get("title") || "").trim();

    if (!title) {
        revalidatePath(`/admin/cursos/${courseId}/contenido`);
        return;
    }

    await directus.request(
        createItem("course_modules", {
            title,
            course_id_: courseId,
            status: "published",
        })
    );

    revalidatePath(`/admin/cursos/${courseId}/contenido`);
}

export async function createLesson(
    courseId: string,
    moduleId: string,
    formData: FormData
) {
    const title = String(formData.get("title") || "").trim();

    if (!title) {
        revalidatePath(`/admin/cursos/${courseId}/contenido`);
        return;
    }

    await directus.request(
        createItem("course_lessons", {
            title,
            course_id: courseId,
            module_id: moduleId,
            status: "draft",
            video_status: "pending",
            is_preview: false,
        })
    );

    revalidatePath(`/admin/cursos/${courseId}/contenido`);
}

export async function deleteModule(courseId: string, moduleId: string) {
    await directus.request(deleteItem("course_modules", moduleId));

    revalidatePath(`/admin/cursos/${courseId}/contenido`);
}

export async function deleteLesson(courseId: string, lessonId: string) {
    await directus.request(deleteItem("course_lessons", lessonId));

    revalidatePath(`/admin/cursos/${courseId}/contenido`);
}