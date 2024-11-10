import { Router } from "express";
import productRoutes from "./product/product.route";

const router = Router();

router.use("/product", productRoutes);

export { router as rootRouter };
