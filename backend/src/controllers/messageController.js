import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import cloudinary from "../lib/cloudinary.js";
import {io} from "../lib/socket.js";

export const getSideUsers = async (req, res) => {
  try {
    const myId = req.user._id;

    if (!myId) return res.status(400).json({ message: "Session expired" });

    const users = await User.find({ _id: { $ne: myId } }).select("-password");

    if (users.length === 0)
      return res.status(400).json({ message: "No user found" });

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: otherId } = req.params;

    if (!myId || !otherId)
      return res.status(400).json({ message: "Session expired" });

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherId },
        { receiverId: myId, senderId: otherId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    // 🔥 emit to receiver room ONLY
    io.to(receiverId).emit("receiveMessage", newMessage);

    res.status(200).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
