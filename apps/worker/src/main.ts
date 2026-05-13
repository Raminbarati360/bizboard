import { Worker } from 'bullmq';
import IORedis from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
const concurrency = Number(process.env.WORKER_CONCURRENCY ?? 5);

const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });

const worker = new Worker('bizboard.default', async (job) => {
  console.log(`[worker] processing ${job.name}`, job.data);
  return { ok: true };
}, { connection, concurrency });

worker.on('completed', (job) => console.log(`[worker] completed ${job.id}`));
worker.on('failed', (job, error) => console.error(`[worker] failed ${job?.id}`, error));

console.log(`[worker] started with concurrency=${concurrency}`);
