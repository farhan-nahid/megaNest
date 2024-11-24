/*
  Warnings:

  - Changed the type of `source` on the `Email` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EmailSource" AS ENUM ('USER_VERIFICATION', 'PASSWORD_RESET', 'ACCOUNT_ACTIVATION', 'ORDER_CONFIRMATION');

-- AlterTable
ALTER TABLE "Email" DROP COLUMN "source",
ADD COLUMN     "source" "EmailSource" NOT NULL;
