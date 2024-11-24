import { z } from "zod";

const OrderCheckoutSchema = z.object({
  body: z.object({
    userId: z.string().cuid(),
    userName: z.string(),
    userEmail: z.string().email(),
    cartSessionId: z.string(),
  }),
});

const CartItemSchema = z.object({
  body: z.object({
    inventoryId: z.string().cuid(),
    productId: z.string().cuid(),
    quantity: z.number().int(),
  }),
});

export { CartItemSchema, OrderCheckoutSchema };
