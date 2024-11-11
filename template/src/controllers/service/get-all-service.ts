import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const getAllInventory = catchAsync(async (_req: Request, res: Response) => {
  const inventory = await prisma.inventory.findMany({ orderBy: { createdAt: "desc" } });

  if (!inventory) {
    throw new ApiError(400, "Inventory not found");
  }

  res.status(200).json({ message: "Success", total: inventory.length, data: inventory });
});

export default getAllInventory;
