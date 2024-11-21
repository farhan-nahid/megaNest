import { getEmails, sendEmail } from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import { EmailSendSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/send", validateResource(EmailSendSchema), sendEmail);
router.get("/", getEmails);

export default router;
