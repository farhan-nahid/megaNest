import { ActionType } from "@prisma/client";
import { z } from "zod";

const InventorySchema = z.object({
  productId: z.string().min(1),
  sku: z.string().min(1),
  quantity: z.number().int().optional().default(0),
});

const InventoryCreateDTOSchema = z.object({
  body: InventorySchema,
});

const InventoryBulkCreateDTOSchema = z.object({
  body: z.object({
    items: z.array(InventorySchema),
  }),
});

const InventoryUpdateDTOSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    quantity: z.number().int().min(1),
    actionType: z.nativeEnum(ActionType),
  }),
});

const InventoryBulkUpdateDTOSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        sku: z.string().min(1),
        quantity: z.number().int().min(1),
        actionType: z.nativeEnum(ActionType),
      })
    ),
  }),
});

const GetInventoryByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export {
  GetInventoryByIdSchema,
  InventoryBulkCreateDTOSchema,
  InventoryBulkUpdateDTOSchema,
  InventoryCreateDTOSchema,
  InventoryUpdateDTOSchema,
};
