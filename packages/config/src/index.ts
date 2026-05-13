import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  JWT_ACCESS_SECRET: z.string().min(16).optional(),
  JWT_REFRESH_SECRET: z.string().min(16).optional(),
  API_CORS_ORIGINS: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_WEB_URL: z.string().url().optional(),
  NEXT_PUBLIC_ADMIN_URL: z.string().url().optional(),

  AI_DEFAULT_PROVIDER: z.enum(['gapgpt', 'openai', 'deepseek', 'openai-compatible']).default('gapgpt'),
  AI_DEFAULT_CHAT_MODEL: z.string().default('gpt-4o-mini'),
  AI_DEFAULT_EMBEDDING_PROVIDER: z.string().default('gapgpt'),
  AI_DEFAULT_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  AI_ALLOW_PROVIDER_FALLBACK: z.coerce.boolean().default(false),
  AI_LOG_PROMPTS: z.coerce.boolean().default(true),
  AI_LOG_RESPONSES: z.coerce.boolean().default(false),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().default(60000),
  AI_MAX_RETRIES: z.coerce.number().default(2),

  GAPGPT_API_KEY: z.string().optional(),
  GAPGPT_BASE_URL: z.string().url().default('https://api.gapgpt.app/v1'),
  GAPGPT_CHAT_MODEL: z.string().default('gpt-4o-mini'),
  GAPGPT_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),

  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().default('https://api.openai.com/v1'),
  OPENAI_ORGANIZATION_ID: z.string().optional(),
  OPENAI_PROJECT_ID: z.string().optional(),
  OPENAI_CHAT_MODEL: z.string().default('gpt-4o-mini'),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),

  DEEPSEEK_API_KEY: z.string().optional(),
  DEEPSEEK_BASE_URL: z.string().url().default('https://api.deepseek.com'),
  DEEPSEEK_CHAT_MODEL: z.string().default('deepseek-chat'),

  SENTRY_DSN: z.string().optional(),
  PAYMENT_CALLBACK_BASE_URL: z.string().url().optional(),
  ZARINPAL_MERCHANT_ID: z.string().optional(),
  ZIBAL_MERCHANT_ID: z.string().optional(),
  PAYMENT_GATEWAY_MODE: z.enum(['mock', 'sandbox', 'production']).default('mock')
});

export type BizboardEnv = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): BizboardEnv {
  return envSchema.parse(source);
}

export function corsOrigins(value?: string): string[] {
  return value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
}

export function requireServerSecret(name: string, value?: string): string {
  if (!value) throw new Error(`${name} is required on server-side runtime only`);
  return value;
}
