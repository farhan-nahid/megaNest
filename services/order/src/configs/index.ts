import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const PRODUCT_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:4001";
export const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:4002";
export const EMAIL_URL = process.env.EMAIL_SERVICE_URL || "http://localhost:4005";
export const CART_URL = process.env.CART_SERVICE_URL || "http://localhost:4006";
