"use server";

import { directus } from "@/lib/directus";
import { updateItem } from "@directus/sdk";
import { revalidatePath } from "next/cache";

export async function updateLesson(
    lessonId: string,
    formData: FormData
) {
    const title = String(formData.get("title") || "").trim();
    const description = String(
        formData.get("description") || ""
    ).trim();

    const status = String(
        formData.get("status") || "draft"
    );

    const isPreview =
        formData.get("is_preview") === "on";

    await directus.request(
        updateItem(
            "course_lessons",
            lessonId,
            {
                title,
                description,
                status,
                is_preview: isPreview,
            }
        )
    );

    revalidatePath(`/admin/lecciones/${lessonId}`);
}