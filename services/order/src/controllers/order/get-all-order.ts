import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const getAllOrder = catchAsync(async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({ include: { items: true } });

  res.status(200).json({ message: "Success", data: orders });
});

export default getAllOrder;
