import { Router } from "express";
import cartRoutes from "./cart/cart.route";

const router = Router();

router.use("/cart", cartRoutes);

export { router as rootRouter };
