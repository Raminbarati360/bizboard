# معماری AI Provider بیزبورد

## قانون اصلی

هیچ بخش business logic، controller، frontend، worker یا crawler نباید مستقیم GapGPT، OpenAI، DeepSeek یا provider دیگری را صدا بزند. همه درخواست‌ها باید از مسیر زیر عبور کنند:

```txt
apps/api/src/modules/ai/ai-router.service.ts
apps/api/src/modules/ai/ai-provider-registry.ts
packages/ai-core/src/providers/*
```

## Providerهای اولیه

- `gapgpt`: provider پیش‌فرض staging
- `openai`: خاموش تا زمانی که key تنظیم شود
- `deepseek`: خاموش تا زمانی که key تنظیم شود
- هر API سازگار با OpenAI از `OpenAiCompatibleProvider` قابل اضافه شدن است.

## امنیت

- API key فقط در env سمت سرور باشد.
- fallback بین providerها فعلاً خاموش است؛ چون ممکن است داده کاربر به provider دیگری برود.
- response و prompt کامل به صورت پیش‌فرض ذخیره نشود؛ فقط usage، latency، provider، model و status لاگ شود.
- خروجی ساختاریافته AI در sprint واقعی باید validate شود.

## Env اصلی

```txt
AI_DEFAULT_PROVIDER=gapgpt
AI_ALLOW_PROVIDER_FALLBACK=false
GAPGPT_API_KEY=
GAPGPT_BASE_URL=https://api.gapgpt.app/v1
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
```
