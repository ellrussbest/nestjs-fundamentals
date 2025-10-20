import * as z from 'zod/v4';

export const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  DATABASE_USERNAME: z.string(),
  DATABASE_USER_PASSWORD: z.string(),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.coerce
    .number<string>()
    .prefault('5432')
    .transform((val) => Number(val))
    .refine((val) => Number.isInteger(val) && val > 0, {
      message: 'DATABASE_PORT must be a positive integer',
    }),
});
