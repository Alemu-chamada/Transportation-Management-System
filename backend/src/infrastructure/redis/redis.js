const Redis = require("ioredis");
const env = require("../../config/env.js");
const logger = require("../../shared/utils/logger.js");

// Create a mock redis client that does nothing
const createMockRedis = () => ({
  get: async () => null,
  set: async () => 'OK',
  del: async () => 1,
  setex: async () => 'OK',
  expire: async () => 1,
  exists: async () => 0,
  ping: async () => 'PONG',
  on: () => {},
  quit: async () => 'OK'
});

// Don't use Redis if URL is localhost (production without Redis)
if (env.redisUrl.includes('localhost')) {
  logger.warn("Redis disabled - using mock client (no caching)");
  module.exports = createMockRedis();
} else {
  // Try to connect to real Redis
  try {
    const redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: () => null // Don't retry
    });

    redis.on("connect", () => {
      logger.info("Redis connected");
    });

    redis.on("error", (error) => {
      logger.warn("Redis error (continuing without Redis)", { message: error.message });
    });

    module.exports = redis;
  } catch (error) {
    logger.warn("Redis initialization failed - using mock client", { error: error.message });
    module.exports = createMockRedis();
  }
}
