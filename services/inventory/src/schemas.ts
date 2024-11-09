import { ActionType } from "@prisma/client";
import { z } from "zod";

const InventoryCreateDTOSchema = z.object({
  body: z.object({
    productId: z.string(),
    sku: z.string(),
    quantity: z.number().int().optional().default(0),
  }),
});

const InventoryBulkCreateDTOSchema = z.object({
  body: z.object({
    items: z.array(InventoryCreateDTOSchema),
  }),
});

const InventoryUpdateDTOSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    quantity: z.number().int(),
    actionType: z.nativeEnum(ActionType),
  }),
});

const InventoryBulkUpdateDTOSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        id: z.string(),
        quantity: z.number().int(),
        actionType: z.nativeEnum(ActionType),
      })
    ),
  }),
});

const GetInventoryByIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export {
  GetInventoryByIdSchema,
  InventoryBulkCreateDTOSchema,
  InventoryBulkUpdateDTOSchema,
  InventoryCreateDTOSchema,
  InventoryUpdateDTOSchema,
};
