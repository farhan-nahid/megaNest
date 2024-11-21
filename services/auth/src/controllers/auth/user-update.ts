import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const userUpdate = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, status, verified, role } = req.body ?? {};

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const payload = {
    ...(email && { email }),
    ...(name && { name }),
    ...(status && { status }),
    ...(verified && { verified }),
    ...(role && { role }),
  };

  const updatedUser = await prisma.user.update({
    where: { id },
    data: payload,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      verified: true,
    },
  });

  res.status(200).json({ user: updatedUser });
});

export default userUpdate;
