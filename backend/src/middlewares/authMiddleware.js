import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.jwt) {
      token = req.cookies.jwt;
      } else if (
        req.headers.authorization?.startsWith("Bearer ")
) {
  token =
    req.headers.authorization.split(
      " "
    )[1];
}

    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; 

    next();
  } catch (error) {
    console.log("🔥 AUTH ERROR:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
