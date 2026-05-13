import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
const concurrency = Number(process.env.CRAWLER_CONCURRENCY ?? 2);
const userAgent = process.env.CRAWLER_USER_AGENT ?? 'BizboardBot/0.1';
const respectRobots = process.env.CRAWLER_RESPECT_ROBOTS !== 'false';

const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

const worker = new Worker('bizboard.crawler', async (job) => {
  console.log('[crawler] legal crawl shell', { job: job.name, userAgent, respectRobots, data: job.data });
  return { ok: true, skipped: true, reason: 'Crawler extractor implementation belongs to crawler sprint.' };
}, { connection, concurrency });

worker.on('completed', (job) => console.log(`[crawler] completed ${job.id}`));
worker.on('failed', (job, error) => console.error(`[crawler] failed ${job?.id}`, error));

console.log(`[crawler] started concurrency=${concurrency} respectRobots=${respectRobots}`);
