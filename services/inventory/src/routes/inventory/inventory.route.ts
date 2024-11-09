import {
  createBulkInventory,
  createInventory,
  getAllInventory,
  getInventoryById,
  getInventoryDetails,
  updateBulkInventory,
  updateInventory,
} from "@/controllers";
import { validateResource } from "@/lib/validate-resource";
import {
  GetInventoryByIdSchema,
  InventoryBulkCreateDTOSchema,
  InventoryBulkUpdateDTOSchema,
  InventoryCreateDTOSchema,
  InventoryUpdateDTOSchema,
} from "@/schemas";
import { Router } from "express";

const router = Router();

router.get("/", getAllInventory);
router.get("/:id", validateResource(GetInventoryByIdSchema), getInventoryById);
router.get("/:id/details", validateResource(GetInventoryByIdSchema), getInventoryDetails);
router.post("/", validateResource(InventoryCreateDTOSchema), createInventory);
router.post("/bulk", validateResource(InventoryBulkCreateDTOSchema), createBulkInventory);
router.put("/:id", validateResource(InventoryUpdateDTOSchema), updateInventory);
router.put("/bulk", validateResource(InventoryBulkUpdateDTOSchema), updateBulkInventory);

export default router;
