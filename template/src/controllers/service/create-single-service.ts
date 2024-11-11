import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const createInventory = catchAsync(async (req: Request, res: Response) => {
  const { quantity, sku } = req.body;

  const existingInventory = await prisma.inventory.findUnique({ where: { sku } });

  if (existingInventory?.id) {
    throw new ApiError(400, "Inventory with the same SKU already exists");
  }

  const inventory = await prisma.inventory.create({
    data: {
      ...req.body,
      histories: {
        create: {
          actionType: "IN",
          lastQuantity: 0,
          quantityChanged: quantity,
          newQuantity: quantity,
        },
      },
    },
    select: { id: true, quantity: true },
  });

  res.status(201).json({ message: "Success", data: inventory });
});

export default createInventory;
