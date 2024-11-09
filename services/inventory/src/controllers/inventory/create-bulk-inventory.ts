import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const createBulkInventory = catchAsync(async (req: Request, res: Response) => {
  const { items } = req.body; // Expecting an array of inventory items

  if (!Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ message: "Items array is required and cannot be empty." });
  }

  const createdItems = await prisma.$transaction(
    items.map((item) =>
      prisma.inventory.create({
        data: {
          ...item,
          histories: {
            create: {
              actionType: "IN",
              lastQuantity: 0,
              quantityChanged: item.quantity,
              newQuantity: item.quantity,
            },
          },
        },
        select: { id: true, quantity: true },
      })
    )
  );

  res
    .status(201)
    .json({ message: "Bulk inventory creation successful", data: createdItems });
});

export default createBulkInventory;
