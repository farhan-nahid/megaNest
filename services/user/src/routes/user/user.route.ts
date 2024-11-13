// import { getAllInventory } from "@/controllers";

import { createUser, getUserById, updateUser } from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import { UserCreateSchema, UserGetSchema, UserUpdateSchema } from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/", validateResource(UserCreateSchema), createUser);
router.get("/:id", validateResource(UserGetSchema), getUserById);
router.patch("/:authUserId", validateResource(UserUpdateSchema), updateUser);

export default router;
