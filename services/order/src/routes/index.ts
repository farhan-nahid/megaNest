import { Router } from "express";
import orderRoutes from "./order/order.route";

const router = Router();

router.use("/order", orderRoutes);

export { router as rootRouter };
