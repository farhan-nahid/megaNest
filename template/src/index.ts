import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { ApiError } from "./lib/api-error";
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

// DEFAULT CATCH
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

// ERROR HANDLER
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    next(res.status(err.statusCode).json(err.toJSON()));
  } else {
    next(res.status(500).json({ message: "Internal Server Error", err }));
  }
});

app.listen(PORT, () => {
  console.log(`${serviceName} is running on http://localhost:${PORT}`);
});
