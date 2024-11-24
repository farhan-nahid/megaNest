import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = parseInt(process.env.REDIS_PORT!) || 6379;
const CART_TTL = parseInt(process.env.CART_TTL!) || 120;
const INVENTORY_URL = process.env.INVENTORY_SERVICE_URL || "http://localhost:4002";

export { CART_TTL, INVENTORY_URL, REDIS_HOST, REDIS_PORT };
