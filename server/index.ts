import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import { authRouter } from "./routes/auth";
import { serviceRouter } from "./routes/services";
import { bookingRouter } from "./routes/bookings";
import { handleDemo } from "./routes/demo";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import { providerRouter } from "./routes/provider";
import { userRouter } from "./routes/user";
import { paymentRouter } from "./routes/payments";
import { aiRouter } from "./routes/ai";
import { contractRouter } from "./routes/contracts";
import { reviewRouter } from "./routes/reviews";

export function createServer() {
  const app = express();

  connectDB();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/auth", authRouter);
  app.use("/api/services", serviceRouter);
  app.use("/api/bookings", bookingRouter);
  app.use("/api/provider", providerRouter);
  app.use("/api/user", userRouter);
  app.use("/api/payments", paymentRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/contracts", contractRouter);
  app.use("/api/reviews", reviewRouter);

  app.get("/api", (_req, res) => {
    res.json({ message: "ServiceFlow API is running" });
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}