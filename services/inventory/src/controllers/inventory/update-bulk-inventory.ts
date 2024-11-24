import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

interface Data {
  sku: string;
  message: string;
  currentQuantity: number;
  newQuantity: number;
}

const updateBulkInventory = catchAsync(async (req: Request, res: Response) => {
  const { field, items } = req.body;
  const inventoryIds = items.map((e) => e.id);
  const negativeQuantityError: Data[] = [];

  // Fetch existing items based on SKUs in request
  const existingItems = await prisma.inventory.findMany({
    where:
      field === "sku"
        ? { sku: { in: inventoryIds } }
        : { productId: { in: inventoryIds } },
    select: { sku: true, id: true, productId: true, quantity: true },
  });

  // Identify found and missing SKUs
  const foundIds = existingItems.map((item) => item[field]);
  const missingIds = inventoryIds.filter((sku) => !foundIds.includes(sku));

  // Throw an error if there are missing SKUs
  if (missingIds.length > 0) {
    throw new ApiError(404, "Some inventory items not found", { missingIds, field });
  }

  // Prepare update data for found items
  const updateData = items.filter((item) =>
    existingItems.some((existingItem) => {
      if (existingItem[field] === item.id) {
        item.id = existingItem.id; // Attach ID for reference in updates
        return true;
      }
      return false;
    })
  );

  // Perform updates in parallel
  const updatedItems = await Promise.allSettled(
    updateData.map(async (item) => {
      const inventory = await prisma.inventory.findUnique({
        where: { id: item.id },
      });

      // Fetch the latest history entry for the item
      const lastHistory = await prisma.history.findFirst({
        where: { inventoryId: item.id },
        orderBy: { createdAt: "desc" },
      });

      // Calculate the new quantity based on action type
      let newQuantity = inventory!.quantity;
      if (item.actionType === "IN") {
        newQuantity += item.quantity;
      } else if (item.actionType === "OUT") {
        newQuantity -= newQuantity > item.quantity ? item.quantity : 0;
      }

      // Ensure new quantity is not negative
      if (newQuantity < 0) {
        negativeQuantityError.push({
          sku: item.sku,
          message: "Negative quantity not allowed",
          currentQuantity: inventory!.quantity,
          newQuantity: item.quantity,
        });
      }

      // Update the inventory and add a new history entry
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
        select: { id: true, quantity: true },
      });
    })
  );

  const data = updatedItems
    .filter((result) => result.status === "fulfilled")
    .map((result) => (result as PromiseFulfilledResult<any>).value);

  // Format the response with successful updates and any missing SKUs
  res.status(200).json({
    message: "Bulk update successful",
    data,
    missingIds,
    negativeQuantityError,
  });
});

export default updateBulkInventory;
