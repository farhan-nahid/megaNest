import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const DEFAULT_SENDER = process.env.DEFAULT_SENDER || "";

export { default as transporter } from "./nodemailer";
