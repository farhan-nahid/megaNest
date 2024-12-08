import prisma from "@/lib/prisma";
import { ActionType } from "@prisma/client";

interface Payload {
  id: string;
  quantity: number;
  actionType: ActionType;
}

const updateInventoryService = async (data: Payload) => {
  const { id, quantity, actionType } = data;
  const inventoryExists = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventoryExists) {
    return { inventoryExists: false };
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

  return { inventoryExists: true, data: inventory };
};

export default updateInventoryService;
