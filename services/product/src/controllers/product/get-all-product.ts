import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const getAllProduct = catchAsync(async (_req: Request, res: Response) => {
  const product = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  if (!product) {
    throw new ApiError(400, "product not found");
  }

  res.status(200).json({ message: "Success", total: product.length, data: product });
});

export default getAllProduct;
