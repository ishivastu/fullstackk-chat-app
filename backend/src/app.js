import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

console.log("CLIENT_URL:", process.env.CLIENT_URL);


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", true); // trust first proxy

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


export default app;
