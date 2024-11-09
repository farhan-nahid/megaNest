import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const createInventory = catchAsync(async (req: Request, res: Response) => {
  const { quantity } = req.body;

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
