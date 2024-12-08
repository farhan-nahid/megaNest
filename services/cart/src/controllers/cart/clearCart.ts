import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import { clearFromRedis } from "@/services";
import { Request, Response } from "express";

const clearCart = catchAsync(async (req: Request, res: Response) => {
  try {
    const cartSessionId = req.headers["x-cart-session-id"] as string;

    if (!cartSessionId) {
      res.status(200).json({ message: "Cart is empty" });
    }

    const { session } = await clearFromRedis(cartSessionId);

    if (!session) {
      delete req.headers["x-cart-session-id"];
      return res.status(200).json({ message: "Cart is empty" });
    }

    delete req.headers["x-cart-session-id"];

    return res.status(200).json({ message: "Cart cleared" });
  } catch (error: unknown) {
    throw new ApiError(400, (error as Error)?.message || "Error clearing cart");
  }
});

export default clearCart;
