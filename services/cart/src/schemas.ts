import { z } from "zod";

const CartItemSchema = z.object({
  productId: z.string().cuid(),
  inventoryId: z.string().cuid(),
  quantity: z.number(),
});

const CreateCartSchema = z.object({
  body: CartItemSchema,
});

export { CreateCartSchema };
