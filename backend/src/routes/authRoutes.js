import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  check
} from "../controllers/authController.js";
import { protectRoute } from "../middlewares/authMiddleware.js"
import rateLimiter from "../middlewares/rateLimiter.js";


const router=express.Router();

router.post("/signup", rateLimiter, signup);
router.post("/login", rateLimiter, login);
router.post("/logout", rateLimiter, logout);

router.put("/updateprofile", protectRoute, updateProfile);

router.get("/check",protectRoute,check)

export default router;
