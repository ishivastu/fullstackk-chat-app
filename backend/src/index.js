import "./config/dotenv.js";
import express from "express";
import path from "path";
import { dbConnect } from "./db/db.js";
import { server } from "./lib/socket.js";
import app from "./app.js";

const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
  });
}

dbConnect()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ DB connection failed:", err);
  });
