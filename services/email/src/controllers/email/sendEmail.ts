import { DEFAULT_SENDER, transporter } from "@/configs";
import { ApiError } from "@/lib/api-error";
import { catchAsync } from "@/lib/catch-async";
import prisma from "@/lib/prisma";
import { Request, Response } from "express";

const sendEmail = catchAsync(async (req: Request, res: Response) => {
  const { subject, body, sender, recipient, source } = req.body ?? {};
  console.log(JSON.stringify(req.body));
  const from = sender ? sender : DEFAULT_SENDER;
  console.log(from);
  const emailOption = {
    from,
    to: recipient,
    subject: subject,
    text: body,
  };

  // Send email logic here
  const { rejected } = await transporter.sendMail(emailOption);
  console.log(rejected);
  if (rejected.length > 0) {
    throw new ApiError(400, "Email not sent");
  }

  await prisma.email.create({
    data: {
      source,
      sender: from,
      recipient,
      subject,
      body,
    },
  });

  res.status(200).json({ message: "Email sent" });
});

export default sendEmail;
