import { Router } from "express";
import inventoryRoutes from "./inventory/inventory.route";

const router = Router();

router.use("/inventory", inventoryRoutes);

export { router as rootRouter };
