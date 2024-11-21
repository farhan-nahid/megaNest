import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import e from "cors";
import { Request, Response } from "express";

const getEmails = catchAsync(async (req: Request, res: Response) => {
  const emails = await prisma.email.findMany();

  res.status(200).json({ data: emails });
});

export default getEmails;
