import { z } from "zod";

const EmailSendSchema = z.object({
  body: z.object({
    sender: z.string().email().optional(),
    recipient: z.string().email(),
    subject: z.string(),
    body: z.string(),
    source: z.string(),
  }),
});

export { EmailSendSchema };
