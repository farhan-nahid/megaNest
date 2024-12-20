import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const getInventoryDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inventory = await prisma.inventory.findUnique({
    where: { id },
    include: {
      histories: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!inventory) {
    throw new ApiError(400, "Inventory not found");
  }

  res.status(200).json({ data: inventory });
});

export default getInventoryDetails;
