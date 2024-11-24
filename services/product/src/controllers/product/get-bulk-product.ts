import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const getBulkProduct = catchAsync(async (req: Request, res: Response) => {
  const { productIds } = req.body;

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, sku: true, name: true, price: true },
  });

  if (products.length === 0) {
    throw new ApiError(404, "Products not found");
  }

  res.status(200).json({ message: "Success", data: products });
});

export default getBulkProduct;
