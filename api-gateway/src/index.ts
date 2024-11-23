import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { ApiError } from "./lib/api-error";
import { configureRoutes } from "./lib/utils";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// security middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  handler: (_req, res) => {
    res.status(429).json({ message: "Too many requests, please try again later." });
  },
});
app.use("/api", limiter);

// routes
configureRoutes(app);

// health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ message: "API Gateway is running" });
});

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

app.listen(PORT, () => console.log(`Api Gateway is running on http://localhost:${PORT}`));
