import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import { updateInventoryService } from "@/services";
import { Request, Response } from "express";

const updateInventory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { quantity, actionType } = req.body;

  const payload = { id, quantity, actionType };

  const { inventoryExists, data } = await updateInventoryService(payload);

  // const inventoryExists = await prisma.inventory.findUnique({
  //   where: { id },
  // });

  if (!inventoryExists) {
    throw new ApiError(400, "Inventory not found");
  }

  // find last history
  // const lastHistory = await prisma.history.findFirst({
  //   where: { inventoryId: id },
  //   orderBy: { createdAt: "desc" },
  // });

  // let newQuantity = inventoryExists.quantity;

  // if (actionType === "IN") {
  //   newQuantity += quantity;
  // } else {
  //   newQuantity -= quantity;
  // }

  // // update inventory
  // const inventory = await prisma.inventory.update({
  //   where: { id },
  //   data: {
  //     quantity: newQuantity,
  //     histories: {
  //       create: {
  //         actionType,
  //         newQuantity,
  //         quantityChanged: quantity,
  //         lastQuantity: lastHistory?.newQuantity || 0,
  //       },
  //     },
  //   },
  //   select: { id: true, quantity: true },
  // });

  res.status(200).json({ message: "Success", data: data });
});

export default updateInventory;
