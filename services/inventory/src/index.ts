import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";

import { rootRouter } from "./routes";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(cors());
app.use(morgan("dev"));

const PORT = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME;

app.get("/health", (_req, res) => {
  res.status(200).json({ message: `${serviceName} api server health is OK.` });
});

// Routes
app.use("/", rootRouter);

// 404 handler
app.use((_req, _res, next) => next(createError(404, "Not Found")));

// Error handler
app.use((err, _req, _res, next) => {
  next(createError(err?.statusCode || 500, err.message));
});

app.listen(PORT, () => console.log(`${serviceName} is running on port ${PORT}`));
