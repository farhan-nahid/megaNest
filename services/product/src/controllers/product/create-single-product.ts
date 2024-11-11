import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const { quantity, sku } = req.body;

  const existingProduct = await prisma.product.findUnique({ where: { sku } });

  if (existingProduct?.id) {
    throw new ApiError(400, "product with the same SKU already exists");
  }

  const product = await prisma.product.create({
    data: {
      ...req.body,
    },
    select: { id: true },
  });

  res.status(201).json({ message: "Success", data: product });
});

export default createProduct;
