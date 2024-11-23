import { clearCart } from "@/services";
import { Redis } from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../configs";

export const redisConfig = {
  host: REDIS_HOST,
  port: REDIS_PORT,
};

const redis = new Redis(redisConfig);

const CHANNEL_KEY_EXPIRES = "__keyevent@0__:expired";
redis.config("SET", "notify-keyspace-events", "Ex");
redis.subscribe(CHANNEL_KEY_EXPIRES);

redis.on("message", async (channel, message) => {
  if (channel === CHANNEL_KEY_EXPIRES) {
    console.log("Key expired: ", message);
    const cartKey = message.split(":").pop();
    if (!cartKey) return;
    await clearCart(cartKey);
    // const cartSessionId = message.split(":")[1];
    // await redis.del(`cart:${cartSessionId}`);
  }
});
