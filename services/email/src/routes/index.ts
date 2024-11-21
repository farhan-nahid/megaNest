import { Router } from "express";
import emailRoutes from "./email/email.route";

const router = Router();

router.use("/email", emailRoutes);

export { router as rootRouter };
