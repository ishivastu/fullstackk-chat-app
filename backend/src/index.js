import "./config/dotenv.js";
import express from "express";
import path from "path";
import { dbConnect } from "./db/db.js";
import { server } from "./lib/socket.js";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

// ✅ Fix for __dirname in ES modules
const __dirname = path.resolve();

// ✅ Serve frontend in production (FIXED VERSION)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // 🔥 IMPORTANT: use app.use instead of app.get("*")
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// ✅ Start server after DB connection
dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB connection failed:", err);
  });
