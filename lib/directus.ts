import { createDirectus, rest } from "@directus/sdk";

export const directus = createDirectus(
    process.env.DIRECTUS_URL!
).with(rest());