import { emailRequest } from "@/configs/axios";
import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";
import { Request, Response } from "express";

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { code, email } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(400, "User with this email does not exist");
  }

  const verificationCode = await prisma.verificationCode.findFirst({
    where: { code, userId: user.id },
  });

  if (!verificationCode) {
    throw new ApiError(400, "Invalid verification code");
  }

  if (verificationCode.expiresAt < dayjs().toDate()) {
    throw new ApiError(400, "Verification code has expired");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, status: "ACTIVE" },
  });

  await prisma.verificationCode.update({
    where: { id: verificationCode.id },
    data: { status: "USED", verifiedAt: dayjs().toISOString() },
  });

  await emailRequest.post("/email/send", {
    recipient: user.email,
    subject: "Email verified",
    body: "Your email has been verified successfully",
    source: "ACCOUNT_ACTIVATION",
  });

  res.status(200).json({ message: "Email verified successfully" });
});

export default verifyEmail;
