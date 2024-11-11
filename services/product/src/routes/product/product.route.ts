import {
  createSingleProduct,
  getAllProduct,
  getSingleProduct,
  updateSingleProduct,
} from "@/controllers";
import { Router } from "express";

const router = Router();

router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);
router.post("/", createSingleProduct);
router.patch("/:id", updateSingleProduct);

export default router;
