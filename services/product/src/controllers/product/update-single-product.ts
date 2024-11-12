import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const updateSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { sku } = req.body;

  let productExistSku: any = {};
  const productExists = await prisma.product.findUnique({ where: { id } });
  if (sku) {
    productExistSku = await prisma.product.findFirst({ where: { sku: sku } });
  }

  if (!productExists) {
    throw new ApiError(400, "Product not found");
  }

  if (productExistSku?.id && productExistSku.id !== id) {
    throw new ApiError(400, "Product with the same SKU already exists");
  }

  // update product
  const product = await prisma.product.update({
    where: { id },
    data: { ...req.body },
  });

  res.status(200).json({ message: "Success", data: product });
});

export default updateSingleProduct;
