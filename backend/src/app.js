import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// ✅ CORS (important for frontend connection)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// ✅ Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

export default app;
