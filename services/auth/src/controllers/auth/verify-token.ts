import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";
import jsonWebToken from "jsonwebtoken";

const verifyToken = catchAsync(async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  const decoded = jsonWebToken.verify(accessToken, process.env.JWT_SECRET!);

  const user = await prisma.user.findUnique({
    where: { id: decoded?.id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) {
    throw new ApiError(401, "UnAuthorized");
  }

  return res.status(200).json({ message: "Authorized", data: user });
});

export default verifyToken;
