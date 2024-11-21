import {
  userLogin,
  userRegistration,
  userUpdate,
  verifyEmail,
  verifyToken,
} from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import {
  AccessTokensSchema,
  EmailVerificationSchema,
  UserLoginSchema,
  UserRegisterSchema,
  UserUpdateSchema,
} from "@/schemas";
import { Router } from "express";

const router = Router();

router.post("/register", validateResource(UserRegisterSchema), userRegistration);
router.post("/login", validateResource(UserLoginSchema), userLogin);
router.post("/verify-token", validateResource(AccessTokensSchema), verifyToken);
router.post("/verify-email", validateResource(EmailVerificationSchema), verifyEmail);
router.patch("/user/:id", validateResource(UserUpdateSchema), userUpdate);

export default router;
