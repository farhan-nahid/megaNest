/*
  Warnings:

  - You are about to drop the column `productId` on the `History` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `History` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_inventoryId_fkey";

-- AlterTable
ALTER TABLE "History" DROP COLUMN "productId",
DROP COLUMN "sku";

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "Inventory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
