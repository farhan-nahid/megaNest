import { Router } from "express";
import serviceRoutes from "./service/service.route";

const router = Router();

router.use("/service", serviceRoutes);

export { router as rootRouter };
