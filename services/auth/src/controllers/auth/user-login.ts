import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jsonWebToken from "jsonwebtoken";

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user?.status !== "ACTIVE") {
    throw new ApiError(401, "User is inactive");
  }

  if (!user.verified) {
    throw new ApiError(401, "User is not verified");
  }

  const token = jsonWebToken.sign(
    { id: user.id, name: user?.name, email: user?.email, role: user?.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.status(200).json({ token });
});

export default userLogin;
