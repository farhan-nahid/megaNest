import { CART_TTL } from "@/configs";
import { inventoryRequest } from "@/configs/axios";
import redis from "@/configs/redis";
import { catchAsync } from "@/lib/catch-async";
import { sendToQueue } from "@/lib/queue";
import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

type CART_SESSION_ID = string | null;

const addCart = catchAsync(async (req: Request, res: Response) => {
  const { productId, inventoryId, quantity } = req?.body;

  let cartSessionId: CART_SESSION_ID = req?.headers["x-cart-session-id"] as string;

  if (cartSessionId) {
    const existingCart = await redis.exists(`sessions:${cartSessionId}`);

    if (!existingCart) {
      cartSessionId = null;
    }
  }

  if (!cartSessionId) {
    cartSessionId = uuid();

    // set cart session id in the redis
    await redis.setex(`sessions:${cartSessionId}`, CART_TTL, cartSessionId);

    // set cart session id in the header
    res.setHeader("x-cart-session-id", cartSessionId);
  }

  const response = await inventoryRequest.get(`/inventory/${inventoryId}`);

  if (response?.data?.data?.quantity < quantity) {
    return res.status(400).json({ message: "Not enough inventory" });
  }

  // add item to cart
  await redis.hset(
    `cart:${cartSessionId}`,
    productId,
    JSON.stringify({ inventoryId, quantity })
  );

  // await inventoryRequest.patch(`/inventory/${inventoryId}`, {
  //   quantity: quantity,
  //   actionType: "OUT",
  // });

  await sendToQueue(
    "update-inventory",
    JSON.stringify({ inventoryId, quantity, actionType: "OUT" })
  );

  return res.status(201).json({ message: "Item added to cart", cartSessionId });
});

export default addCart;
