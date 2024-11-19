import { Injectable } from '@nestjs/common';
import { z, ZodType } from 'zod';

@Injectable()
export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(3).max(100),
    last_name: z.string().max(100).optional(),
    email: z.string().email().min(10).max(100),
    phone: z.string().min(8).max(20),
    social_linkedin: z.string().max(100).optional(),
    social_fb: z.string().max(100).optional(),
    social_x: z.string().max(100).optional(),
    social_yt: z.string().max(100).optional(),
    social_ig: z.string().max(100).optional(),
    social_github: z.string().max(100).optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    first_name: z.string().min(3).max(100).optional(),
    last_name: z.string().max(100).optional(),
    email: z.string().email().min(10).max(100).optional(),
    phone: z.string().min(8).max(20).optional(),
    social_linkedin: z.string().max(100).optional(),
    social_fb: z.string().max(100).optional(),
    social_x: z.string().max(100).optional(),
    social_yt: z.string().max(100).optional(),
    social_ig: z.string().max(100).optional(),
    social_github: z.string().max(100).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    name: z.string().min(1).optional(),
    email: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
