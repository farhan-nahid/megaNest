import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const updateUserById = catchAsync(async (req: Request, res: Response) => {
  const { authUserId } = req.params;
  const { field, ...data } = req.body;
  const isAuthUserId = field === "authUserId";

  const userExists = await prisma.user.findUnique({
    where: isAuthUserId ? { authUserId } : { id: authUserId },
  });

  if (!userExists) {
    throw new ApiError(400, "User not found");
  }

  // update user
  const user = await prisma.user.update({
    where: isAuthUserId ? { authUserId } : { id: authUserId },
    data: data,
  });

  res.status(200).json({ message: "Success", data: user });
});

export default updateUserById;
