// controllers/messageController.js

import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "MERN Chat App",
  },
});

export const getSideUsers = async (req, res) => {
  try {
    const myId = req.user._id.toString();

    if (!myId) {
      return res.status(400).json({
        message: "Session expired",
      });
    }

    const users = await User.find({
      _id: { $ne: myId },
    }).select("-password");

    return res.status(200).json(users);
  } catch (error) {
    console.log("Error in getSideUsers:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const { id } = req.params;

    // AI Chat
    if (id === "ai-chat") {
      const messages = await Message.find({
        $or: [
          {
            senderId: myId,
            receiverId: "ai-chat",
          },
          {
            senderId: "ai-chat",
            receiverId: myId,
          },
        ],
      }).sort({ createdAt: 1 });

      return res.status(200).json(messages);
    }

    // Normal Chat
    const messages = await Message.find({
      $or: [
        {
          senderId: myId,
          receiverId: id,
        },
        {
          senderId: id,
          receiverId: myId,
        },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id.toString();

    // =========================
    // AI CHAT
    // =========================
    if (receiverId === "ai-chat") {
      if (!text || !text.trim()) {
        return res.status(400).json({
          message: "Message text is required",
        });
      }

      const userMessage = new Message({
        senderId,
        receiverId: "ai-chat",
        text,
        isAIMessage: false,
      });

      await userMessage.save();

      const completion = await openai.chat.completions.create({
        model: "openrouter/auto",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant for students. Help with DSA, coding, interviews, resume, development, web development, debugging, and career guidance.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      });

      const aiReply =
        completion?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      const botMessage = new Message({
        senderId: "ai-chat",
        receiverId: senderId,
        text: aiReply,
        isAIMessage: true,
      });

      await botMessage.save();

      return res.status(201).json(userMessage);
    }

    // =========================
    // NORMAL USER CHAT
    // =========================

    let imageUrl = "";

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      isAIMessage: false,
    });

    await newMessage.save();

    // receiver socket
    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", newMessage);
    }

    // sender socket
    const senderSocketId = getReceiverSocketId(senderId);

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log(
      "Error in sendMessages:",
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message:
        error.response?.data?.error?.message ||
        error.message ||
        "Internal server error",
    });
  }
};
