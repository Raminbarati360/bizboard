import { z } from 'zod';

export const requestOtpSchema = z.object({
  destination: z.string().min(5),
  purpose: z.enum(['login', 'register', 'passwordless']).default('login')
});

export const verifyOtpSchema = z.object({
  destination: z.string().min(5),
  code: z.string().min(4).max(8)
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  categorySlug: z.string().optional(),
  brandSlug: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20)
});

export const createBusinessSchema = z.object({
  name: z.string().min(2),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  businessType: z.enum(['online_shop', 'local_store', 'restaurant', 'service_provider', 'brand', 'marketplace_vendor', 'real_estate', 'clinic', 'education', 'tourism']),
  websiteUrl: z.string().url().optional()
});

export const aiMessageSchema = z.object({
  message: z.string().min(1).max(2000),
  context: z.record(z.unknown()).optional()
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type AiMessageInput = z.infer<typeof aiMessageSchema>;
