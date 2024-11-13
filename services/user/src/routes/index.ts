import { Router } from "express";
import serviceRoutes from "./user/user.route";

const router = Router();

router.use("/user", serviceRoutes);

export { router as rootRouter };
