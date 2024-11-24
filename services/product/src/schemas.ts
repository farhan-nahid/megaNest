import { Status } from "@prisma/client";
import { z } from "zod";

const ProductCreateDTOSchema = z.object({
  body: z.object({
    sku: z.string().min(3).max(10),
    name: z.string().min(3).max(255),
    description: z.string().max(1000).optional(),
    price: z.number().optional().default(0),
    status: z.nativeEnum(Status).optional().default(Status.DRAFT),
  }),
});

const ProductUpdateDTOSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    sku: z.string().min(3).max(10),
    name: z.string().min(3).max(255).optional(),
    description: z.string().max(1000).optional(),
    price: z.number().optional(),
    status: z.nativeEnum(Status).optional(),
  }),
});

const GetBulkProductSchema = z.object({
  body: z.object({
    productIds: z.array(z.string().cuid()),
  }),
});

export { GetBulkProductSchema, ProductCreateDTOSchema, ProductUpdateDTOSchema };
