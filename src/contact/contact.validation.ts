import { z, ZodType } from 'zod';

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(1).max(100),
    last_name: z.string().min(1).max(100).optional(),
    email: z.string().email().max(100).optional(),
    phone: z.string().min(1).max(20),
  });
}
