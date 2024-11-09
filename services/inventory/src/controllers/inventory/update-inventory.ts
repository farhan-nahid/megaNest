import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";
import createError from "http-errors";

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, actionType } = req.body;

  const inventoryExists = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventoryExists) {
    throw createError(404, "Inventory not found");
  }

  // find last history
  const lastHistory = await prisma.history.findFirst({
    where: { inventoryId: id },
    orderBy: { createdAt: "desc" },
  });

  let newQuantity = inventoryExists.quantity;

  if (actionType === "IN") {
    newQuantity += quantity;
  } else {
    newQuantity -= quantity;
  }

  // update inventory
  const inventory = await prisma.inventory.update({
    where: { id },
    data: {
      quantity: newQuantity,
      histories: {
        create: {
          actionType,
          newQuantity,
          quantityChanged: quantity,
          lastQuantity: lastHistory?.newQuantity || 0,
        },
      },
    },
    select: { id: true, quantity: true },
  });

  res.status(200).json({ message: "Success", data: inventory });
});

export default updateInventory;
