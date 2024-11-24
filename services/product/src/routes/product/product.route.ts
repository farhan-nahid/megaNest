import {
  createSingleProduct,
  getAllProduct,
  getBulkProduct,
  getSingleProduct,
  updateSingleProduct,
} from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import {
  GetBulkProductSchema,
  ProductCreateDTOSchema,
  ProductUpdateDTOSchema,
} from "@/schemas";
import { Router } from "express";

const router = Router();

router.get("/", getAllProduct);
router.get("/:id", getSingleProduct);
router.post("/get-bulk", validateResource(GetBulkProductSchema), getBulkProduct);
router.post("/", validateResource(ProductCreateDTOSchema), createSingleProduct);
router.patch("/:id", validateResource(ProductUpdateDTOSchema), updateSingleProduct);

export default router;
