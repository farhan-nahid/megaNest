import { transporter } from "@/configs";
import prisma from "@/lib/prisma";
import { EmailSource } from "@prisma/client";

interface EmailOption {
  from: any;
  to: any;
  subject: any;
  text: any;
}

const sendEmailAndSaveDatabase = async (
  emailOption: EmailOption,
  source: EmailSource
) => {
  const { from, to, subject, text } = emailOption;

  const { rejected } = await transporter.sendMail(emailOption);

  if (rejected?.length > 0) {
    return { rejected };
  }

  await prisma.email.create({
    data: { source, sender: from, recipient: to, subject, body: text },
  });
};

export default sendEmailAndSaveDatabase;
