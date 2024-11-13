import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const { authUserId } = req.params;

  const userExists = await prisma.user.findUnique({
    where: { authUserId },
  });

  if (!userExists) {
    throw new ApiError(400, "User not found");
  }

  // update user
  const user = await prisma.user.update({
    where: { authUserId },
    data: { ...req.body },
  });

  res.status(200).json({ message: "Success", data: user });
});

export default updateUserById;
