import { catchAsync } from "@/lib/catch-async";
import { INVENTORY_URL } from "@/lib/configs";
import prisma from "@/lib/prisma";
import axios from "axios";
import { Request, Response } from "express";

const createProduct = catchAsync(async (req: Request, res: Response) => {
  // check if product with the same sku already exists
  const existingProduct = await prisma.product.findFirst({
    where: {
      sku: req.body?.sku,
    },
  });

  if (existingProduct) {
    return res.status(400).json({ message: "Product with the same SKU already exists" });
  }

  // Create product
  const product = await prisma.product.create({
    data: req.body?.data,
  });
  console.log("Product created successfully", product.id);

  // Create inventory record for the product
  const { data: inventory } = await axios.post(`${INVENTORY_URL}/inventories`, {
    productId: product.id,
    sku: product.sku,
  });
  console.log("Inventory created successfully", inventory.id);

  // update product and store inventory id
  await prisma.product.update({
    where: { id: product.id },
    data: {
      inventoryId: inventory.id,
    },
  });
  console.log("Product updated successfully with inventory id", inventory.id);

  res.status(201).json({ ...product, inventoryId: inventory.id });
});

export default createProduct;
