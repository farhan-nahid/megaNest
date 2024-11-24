import { checkout, getAllOrder, getOrderById } from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import { OrderCheckoutSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/checkout", validateResource(OrderCheckoutSchema), checkout);
router.get("/", getAllOrder);
router.get("/:id", getOrderById);

export default router;
