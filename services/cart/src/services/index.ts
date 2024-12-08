import { inventoryRequest } from "@/configs/axios";
import redis from "@/configs/redis";
import { ApiError } from "@/lib/api-error";

interface Item {
  quantity: number;
  inventoryId: string;
}

const clearCart = async (id: string) => {
  try {
    const data = await redis.hgetall(`cart:${id}`);

    if (Object.keys(data).length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    const items = Object.keys(data).map((key) => {
      const item = JSON.parse(data[key]) as Item;
      return { id: key, quantity: item.quantity, actionType: "IN" };
    });

    await inventoryRequest.patch("/inventory/bulk", { items, field: "productId" });
    await redis.del(`cart:${id}`);
  } catch (error: unknown) {
    throw new ApiError(4000, (error as Error)?.message || "Error clearing cart");
  }
};

const clearFromRedis = async (cartSessionId: string) => {
  const session = await redis.get(`sessions:${cartSessionId}`);

  // Clear cart
  await redis.del(`sessions:${cartSessionId}`);
  await redis.del(`cart:${cartSessionId}`);
  // delete req.headers["x-cart-session-id"];

  return { session };
};

export { clearCart, clearFromRedis };
