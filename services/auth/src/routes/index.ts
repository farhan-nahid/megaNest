import { Router } from "express";
import authRoutes from "./auth/auth.route";

const router = Router();

router.use("/auth", authRoutes);

export { router as rootRouter };
