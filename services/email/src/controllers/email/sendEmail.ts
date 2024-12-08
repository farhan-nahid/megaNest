import { DEFAULT_SENDER } from "@/configs";
import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import { sendEmailAndSaveDatabaseService } from "@/services";
import { Request, Response } from "express";

const sendEmail = catchAsync(async (req: Request, res: Response) => {
  const { subject, body, sender, recipient, source } = req.body ?? {};

  const from = sender ? sender : DEFAULT_SENDER;

  const emailOption = { from, to: recipient, subject: subject, text: body };

  // Send email
  const result = await sendEmailAndSaveDatabaseService(emailOption, source);
  const rejected = result?.rejected ?? [];

  if (rejected?.length > 0) {
    throw new ApiError(400, "Email not sent");
  }

  res.status(200).json({ message: "Email sent" });
});

export default sendEmail;
