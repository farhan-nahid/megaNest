import { userRequest } from "@/configs/axios";
import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

const userRegistration = catchAsync(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Check if user with the same email already exists
  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    throw new ApiError(400, "User with this email already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      verified: true,
    },
  });

  // create user profile
  userRequest.post("/user", { authUserId: user.id, name: user.name, email: user.email });

  res.status(201).json({ user });
});

export default userRegistration;
