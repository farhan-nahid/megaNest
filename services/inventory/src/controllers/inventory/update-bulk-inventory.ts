import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { ActionType } from "@prisma/client";
import { Request, Response } from "express";
import createError from "http-errors";

const updateBulkInventory = catchAsync(async (req: Request, res: Response) => {
  const inventoryIds = req.body.payload.map((e) => e.id);

  const existingInventories = await prisma.inventory.findMany({
    where: { id: { in: inventoryIds } },
  });

  if (existingInventories.length !== inventoryIds.length) {
    const foundIds = existingInventories.map((inventory) => inventory.id);

    const missingIds = [...new Set(inventoryIds.filter((id) => !foundIds.includes(id)))];

    throw createError(404, { message: "Some ids not found", foundIds, missingIds });
  }

  const updatedItems = await Promise.allSettled(
    req.body.payload.map(
      async (item: { id: string; actionType: ActionType; quantity: number }) => {
        const inventory = await prisma.inventory.findUnique({
          where: { id: item.id },
        });

        const lastHistory = await prisma.history.findFirst({
          where: {
            inventoryId: item.id,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        let newQuantity = inventory!.quantity;
        if (item.actionType === "IN") {
          newQuantity += item.quantity;
        } else {
          newQuantity -= item.quantity;
        }

        if (newQuantity < 0) {
          throw createError(
            400,
            `Inventory item ${item.id} cannot have a negative quantity`
          );
        }

        return prisma.inventory.update({
          where: { id: item.id },
          data: {
            quantity: newQuantity,
            histories: {
              create: {
                actionType: item.actionType,
                quantityChanged: item.quantity,
                lastQuantity: lastHistory?.newQuantity || 0,
                newQuantity,
              },
            },
          },
          select: {
            id: true,
            quantity: true,
          },
        });
      }
    )
  );

  res.status(200).json({ message: "Bulk update successful", data: updatedItems });
});

export default updateBulkInventory;
