import * as z from 'zod';

export const PayloadSchema = z.object({
  sub: z.number(),
  email: z.email(),
});

export type PayloadType = z.infer<typeof PayloadSchema>;
