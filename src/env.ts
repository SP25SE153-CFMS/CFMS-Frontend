import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    /**
     * The prefix that client-side variables must have. This is enforced both at
     * a type-level and at runtime.
     */
    clientPrefix: 'NEXT_PUBLIC_',

    client: {
        NEXT_PUBLIC_API_URL: z.string().url().optional(),
        // Firebase
        NEXT_PUBLIC_API_KEY: z.string(),
        NEXT_PUBLIC_AUTH_DOMAIN: z.string(),
        NEXT_PUBLIC_PROJECT_ID: z.string(),
        NEXT_PUBLIC_STORAGE_BUCKET: z.string(),
        NEXT_PUBLIC_MESSAGING_SENDER_ID: z.string(),
        NEXT_PUBLIC_APP_ID: z.string(),
        // Cloudinary
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string(),
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: z.string(),
        // Google Maps
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
    },

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        // Firebase
        NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
        NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
        NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
        NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        NEXT_PUBLIC_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
        // Cloudinary
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        // Google Maps
        NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    },

    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true,
});
