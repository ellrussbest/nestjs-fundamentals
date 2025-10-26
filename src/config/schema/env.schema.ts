import * as z from 'zod/v4';

export const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_USERNAME: z.string().min(1),
  DATABASE_USER_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
  DATABASE_PORT: z.coerce
    .number<string>()
    .prefault('5432')
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'DATABASE_PORT must be a positive integer',
    }),
  JWT_SECRET: z.string().min(1),
  BASE_URL: z.url(),
});
