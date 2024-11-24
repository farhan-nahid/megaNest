import { addCart, clearCart, getCart } from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import { CreateCartSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/add-to-cart", validateResource(CreateCartSchema), addCart);
router.get("/me", getCart);
router.delete("/me", clearCart);

export default router;
