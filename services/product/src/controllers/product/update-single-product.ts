import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const updateSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, actionType } = req.body;

  const productExists = await prisma.product.findUnique({
    where: { id },
  });

  if (!productExists) {
    throw new ApiError(400, "Product not found");
  }

  // update product
  const product = await prisma.product.update({
    where: { id },
    data: {
      ...req.body,
    },
    select: { id: true },
  });

  res.status(200).json({ message: "Success", data: product });
});

export default updateSingleProduct;
