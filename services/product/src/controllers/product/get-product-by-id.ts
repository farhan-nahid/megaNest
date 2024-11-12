import { inventoryRequest } from "@/configs/axios";
import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      sku: true,
      name: true,
      price: true,
      inventoryId: true,
    },
  });

  if (!product) {
    throw new ApiError(400, "product not found");
  }

  if (!product.inventoryId) {
    const response = await inventoryRequest.post("/inventory", {
      productId: product.id,
      sku: product.sku,
    });

    const inventory = response?.data?.data;

    await prisma.product.update({
      where: { id: product.id },
      data: { inventoryId: inventory.id },
    });

    return res.status(200).json({
      ...product,
      inventoryId: inventory.id,
      stock: inventory.quantity || 0,
      stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
    });
  }

  const response = await inventoryRequest.get(`/inventory/${product.inventoryId}`);

  const inventory = response?.data?.data;

  return res.status(200).json({
    data: {
      ...product,
      stock: inventory.quantity || 0,
      stockStatus: inventory.quantity > 0 ? "In stock" : "Out of stock",
    },
  });
});

export default getProductById;
