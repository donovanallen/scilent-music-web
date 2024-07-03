/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Configuration for type-safe environment variables.
 * Imported through src/app/page.tsx
 * @see https://x.com/mattpocockuk/status/1760991147793449396
 */
import { z } from 'zod';

const envVariables = z.object({
  NEXT_PUBLIC_SHOW_LOGGER: z.enum(['true', 'false']).optional(),
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production']),
  NEXT_PUBLIC_BASE_URL: z.string(),
  NEXT_AUTH_URL: z.string(),
  NEXT_AUTH_SECRET: z.string(),
  DB_URL: z.string(),
  DB_PRISMA_URL: z.string(),
  DB_URL_NO_SSL: z.string(),
  DB_URL_NON_POOLING: z.string(),
  DB_USER: z.string(),
  DB_HOST: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
