import redis from "@/configs/redis";
import { catchAsync } from "@/lib/catch-async";
import { Request, Response } from "express";

type CART_SESSION_ID = string | null;

const getCart = catchAsync(async (req: Request, res: Response) => {
  let cartSessionId: CART_SESSION_ID = req?.headers["x-cart-session-id"] as string;

  if (!cartSessionId) {
    res.json({ status: "success", data: [] });
  }

  const session = await redis.exists(`sessions:${cartSessionId}`);
  if (!session) {
    await redis.del(`cart:${cartSessionId}`);
    return res.json({ status: "success", data: [] });
  }

  const data = await redis.hgetall(`cart:${cartSessionId}`);

  if (Object.keys(data).length === 0) {
    return res.json({ status: "success", data: [] });
  }

  const formattedData = Object.keys(data).map((key) => {
    const item = JSON.parse(data[key]);
    return { productId: key, ...item };
  });

  res.json({ status: "success", data: formattedData });
});

export default getCart;
