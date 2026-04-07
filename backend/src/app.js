import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();


app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});


export default app;



