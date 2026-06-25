// app/admin/cursos/nuevo/actions.ts

"use server";

import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";
import { redirect } from "next/navigation";

function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
}

export async function createCourse(formData: FormData) {
    const title = String(formData.get("title") || "").trim();
    const slugInput = String(formData.get("slug") || "").trim();
    const courseCode = String(formData.get("course_code") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const status = String(formData.get("status") || "draft");

    if (!title) {
        throw new Error("El título es obligatorio");
    }

    const slug = slugInput ? slugify(slugInput) : slugify(title);

    const course = await directus.request(
        createItem("courses", {
            title,
            slug,
            course_code: courseCode || null,
            description: description || null,
            status,
        })
    );

    redirect(`/admin/cursos/${course.id}/contenido`);
}