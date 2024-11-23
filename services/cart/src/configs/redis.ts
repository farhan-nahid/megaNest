import { Redis } from "ioredis";
import { REDIS_HOST, REDIS_PORT } from ".";

export const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

const redis = new Redis(redisConfig);

export default redis;
