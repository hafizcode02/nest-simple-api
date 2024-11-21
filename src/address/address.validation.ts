import { Injectable } from '@nestjs/common';
import { z, ZodType } from 'zod';

@Injectable()
export class AddressValidation {
  static readonly CREATE: ZodType = z.object({
    street: z.string().min(3).max(100),
    city: z.string().min(3).max(100),
    province: z.string().min(3).max(100),
    country: z.string().min(3).max(100),
    postalCode: z.string().min(3).max(100),
    detail: z.string().min(3).max(255).optional(),
  });

  static readonly UPDATE: ZodType = z
    .object({
      street: z.string().min(3).max(100),
      city: z.string().min(3).max(100),
      province: z.string().min(3).max(100),
      country: z.string().min(3).max(100),
      postalCode: z.string().min(3).max(100),
      detail: z.string().min(3).max(255),
    })
    .partial();
}
