import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jsonWebToken from "jsonwebtoken";

interface Session {
  userId: string;
  userAgent: string;
  ipAddress: string;
  attempt?: "SUCCESS" | "FAILED";
}

const loginSessions = async (data: Session) => {
  const payload = {
    userId: data.userId,
    userAgent: data.userAgent,
    ipAddress: data.ipAddress,
    attempt: data.attempt ?? "SUCCESS",
  };
  await prisma.session.create({ data: payload });
};

const userLogin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const ipAddress = (req.headers["x-forwarded-for"] as string) || req.ip || "";
  const userAgent = req.get("User-Agent") || "";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    await loginSessions({ userId: "Guest", userAgent, ipAddress, attempt: "FAILED" });
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    await loginSessions({ userId: user.id, userAgent, ipAddress, attempt: "FAILED" });
    throw new ApiError(401, "Invalid credentials");
  }

  if (user?.status !== "ACTIVE") {
    await loginSessions({ userId: user.id, userAgent, ipAddress, attempt: "FAILED" });
    throw new ApiError(401, "User is inactive");
  }

  if (!user.verified) {
    await loginSessions({ userId: user.id, userAgent, ipAddress, attempt: "FAILED" });
    throw new ApiError(401, "User is not verified");
  }

  const token = jsonWebToken.sign(
    { id: user.id, name: user?.name, email: user?.email, role: user?.role },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  await loginSessions({ userId: user.id, userAgent, ipAddress });

  res.status(200).json({ token });
});

export default userLogin;
