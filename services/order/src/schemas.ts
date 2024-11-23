import { z } from "zod";

const OrderCheckoutSchema = z.object({
  body: z.object({
    userId: z.number().int(),
    userName: z.string(),
    productId: z.number().int(),
    cartSessionId: z.string(),
  }),
});

export { OrderCheckoutSchema };
