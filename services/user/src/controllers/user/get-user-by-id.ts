import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";
import { Request, Response } from "express";

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const field = (req.query.field as string) ?? "id";
  const { id } = req.params;
  let user: User | null = null;

  if (field === "authUserId") {
    user = await prisma.user.findUnique({ where: { authUserId: id } });
  } else {
    user = await prisma.user.findUnique({ where: { id } });
  }

  if (!user) {
    throw new ApiError(400, "User not found");
  }

  res.status(200).json({ message: "Success", data: user });
});

export default getUserById;
