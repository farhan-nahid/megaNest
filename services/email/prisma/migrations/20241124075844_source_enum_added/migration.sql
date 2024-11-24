-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EmailSource" ADD VALUE 'CHANGE_PASSWORD';
ALTER TYPE "EmailSource" ADD VALUE 'WELCOME_EMAIL';
ALTER TYPE "EmailSource" ADD VALUE 'ACCOUNT_DEACTIVATION';
ALTER TYPE "EmailSource" ADD VALUE 'ORDER_SHIPPED';
ALTER TYPE "EmailSource" ADD VALUE 'ORDER_DELIVERED';
ALTER TYPE "EmailSource" ADD VALUE 'ORDER_CANCELLED';
ALTER TYPE "EmailSource" ADD VALUE 'CART_ABANDONMENT_REMINDER';
ALTER TYPE "EmailSource" ADD VALUE 'PROMOTIONAL_OFFER';
ALTER TYPE "EmailSource" ADD VALUE 'NEWSLETTER';
ALTER TYPE "EmailSource" ADD VALUE 'PRODUCT_RECOMMENDATION';
ALTER TYPE "EmailSource" ADD VALUE 'REFUND_CONFIRMATION';
ALTER TYPE "EmailSource" ADD VALUE 'PAYMENT_SUCCESS';
ALTER TYPE "EmailSource" ADD VALUE 'PAYMENT_FAILED';
