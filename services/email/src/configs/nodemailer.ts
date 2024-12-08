import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config({ path: ".env" });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT!) || 2525,
  debug: true,
  logger: true,
});

export default transporter;
