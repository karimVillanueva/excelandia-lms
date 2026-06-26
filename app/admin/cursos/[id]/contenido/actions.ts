"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";
import { deleteItem } from "@directus/sdk";

export async function createModule(
    courseId: string,
    formData: FormData
) {
    const title = String(formData.get("title") || "").trim();

    if (!title) {
        return {
            error: "El nombre del módulo es obligatorio",
        };
    }

    await directus.request(
        createItem("course_modules", {
            title,
            course_id: courseId,
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
        throw new Error("La lección necesita un título");
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

export async function deleteModule(
    courseId: string,
    moduleId: string
) {
    await directus.request(
        deleteItem("course_modules", moduleId)
    );

    revalidatePath(`/admin/cursos/${courseId}/contenido`);
}

export async function deleteLesson(
    courseId: string,
    lessonId: string
) {
    await directus.request(
        deleteItem("course_lessons", lessonId)
    );

    revalidatePath(`/admin/cursos/${courseId}/contenido`);
}