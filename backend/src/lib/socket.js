import { Server } from "socket.io";
import http from "http";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // ✅ Join user room
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`✅ User ${userId} joined room`);
  });

  // ✅ Send message
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    console.log("📩 Message:", message);

    // send to receiver room
    io.to(receiverId).emit("receiveMessage", {
      senderId,
      message,
    });
  });

  // ❌ Disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

export { io, server };
