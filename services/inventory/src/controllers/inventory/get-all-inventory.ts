import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";
import createError from "http-errors";

const getAllInventory = catchAsync(async (_req: Request, res: Response) => {
  const inventory = await prisma.inventory.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (!inventory) {
    throw createError(404, "Inventory not found");
  }

  res.status(200).json({ message: "Success", data: inventory });
});

export default getAllInventory;
