import { emailRequest, userRequest } from "@/configs/axios";
import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import { generateVerificationCode } from "@/lib/generate-verification-code";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
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
  await userRequest.post("/user", {
    authUserId: user.id,
    name: user.name,
    email: user.email,
  });

  // generate verification code
  const code = generateVerificationCode();
  console.log({ code });
  await prisma.verificationCode.create({
    data: { code, userId: user.id, expiresAt: dayjs().add(1, "day").toISOString() },
  });

  // send verification email
  await emailRequest.post("/email/send", {
    recipient: user.email,
    subject: "Verify your email",
    body: `Your verification code is ${code}`,
    source: "User verification",
  });

  res.status(201).json({ data: user, message: "User registered successfully" });
});

export default userRegistration;
