import { checkout } from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import { OrderCheckoutSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/checkout", validateResource(OrderCheckoutSchema), checkout);

export default router;
