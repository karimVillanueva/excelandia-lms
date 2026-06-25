"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";

export async function createModule(
    courseId: string,
    formData: FormData
) {
    const title = String(formData.get("title") || "").trim();

    if (!title) {
        throw new Error("El módulo necesita un título");
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