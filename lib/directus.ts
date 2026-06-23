import { createDirectus, rest, staticToken } from "@directus/sdk";

if (!process.env.DIRECTUS_URL) {
    throw new Error("DIRECTUS_URL is required");
}

if (!process.env.DIRECTUS_TOKEN) {
    throw new Error("DIRECTUS_TOKEN is required");
}

export const directus = createDirectus(process.env.DIRECTUS_URL)
    .with(staticToken(process.env.DIRECTUS_TOKEN))
    .with(rest());