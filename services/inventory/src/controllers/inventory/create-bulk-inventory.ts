import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const createBulkInventory = catchAsync(async (req: Request, res: Response) => {
  // existing inventory items
  const existingItems = await prisma.inventory.findMany({
    where: { sku: { in: req.body.items.map((item) => item.sku) } },
    select: { sku: true },
  });

  // create only new items
  const newItems = req.body.items.filter(
    (item) => !existingItems.some((existingItem) => existingItem.sku === item.sku)
  );

  if (newItems.length === 0) {
    throw new ApiError(400, "All items already exist in inventory");
  }

  const items = await prisma.$transaction(
    newItems.map((item) =>
      prisma.inventory.create({
        data: {
          ...item,
          histories: {
            create: {
              actionType: "IN",
              lastQuantity: 0,
              quantityChanged: item.quantity ?? 0,
              newQuantity: item.quantity ?? 0,
            },
          },
        },
        select: { id: true, quantity: true },
      })
    )
  );

  res
    .status(201)
    .json({ message: "Inventory creation successful", data: items, existingItems });
});

export default createBulkInventory;
