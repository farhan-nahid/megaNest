import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const port = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || "service";

app.listen(port, () => {
  console.log(`${serviceName} is running on port ${port}`);
});
