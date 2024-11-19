// import { getAllInventory } from "@/controllers";

import { userLogin, userRegistration } from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import { UserLoginSchema, UserRegisterSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/register", validateResource(UserRegisterSchema), userRegistration);
router.get("/login", validateResource(UserLoginSchema), userLogin);

export default router;
