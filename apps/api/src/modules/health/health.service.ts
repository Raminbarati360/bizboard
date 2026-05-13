import { Injectable } from '@nestjs/common';
import IORedis from 'ioredis';
import { healthcheckDatabase } from '@bizboard/database';

@Injectable()
export class HealthService {
  async check() {
    const [databaseCheck, redisCheck] = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis()
    ]);

    const database = databaseCheck.status === 'fulfilled' ? databaseCheck.value : { ok: false, error: String(databaseCheck.reason) };
    const redis = redisCheck.status === 'fulfilled' ? redisCheck.value : { ok: false, error: String(redisCheck.reason) };
    const ok = Boolean(database.ok && redis.ok);

    return {
      ok,
      service: 'bizboard-api',
      version: '0.1.0-nodejs-v1.1',
      timestamp: new Date().toISOString(),
      checks: { database, redis }
    };
  }

  private async checkDatabase() {
    if (!process.env.DATABASE_URL) return { ok: false, skipped: true, reason: 'DATABASE_URL is not set' };
    const result = await healthcheckDatabase();
    return { ok: true, now: result.now };
  }

  private async checkRedis() {
    if (!process.env.REDIS_URL) return { ok: false, skipped: true, reason: 'REDIS_URL is not set' };
    const redis = new IORedis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    try {
      await redis.connect();
      const pong = await redis.ping();
      return { ok: pong === 'PONG', pong };
    } finally {
      redis.disconnect();
    }
  }
}
