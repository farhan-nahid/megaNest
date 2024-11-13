import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { authUserId } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { authUserId } });

  if (existingUser?.id) {
    throw new ApiError(400, "User already exists");
  }

  const user = await prisma.user.create({ data: { ...req.body } });

  res.status(201).json({ message: "Success", data: user });
});

export default createUser;
