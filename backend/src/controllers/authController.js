import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/generateToken.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    console.log("BODY:", req.body);

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      fullName,
      password: hashedPassword,
    });

    generateToken(user._id, res);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token=generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      token:token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logout successful" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Image required" });
    }

    const upload = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: upload.secure_url },
      { new: true },
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const check = (req, res) => {
  res.status(200).json({
    user: {
      id: req.user._id,
      fullName: req.user.fullName,
      email: req.user.email,
      profilePic: req.user.profilePic,
      createdAt: user.createdAt,
    },
  });
};
