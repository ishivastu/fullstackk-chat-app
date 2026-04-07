import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  check
} from "../controllers/authController.js";
import {protectRoute} from "../middlewares/authMiddleware.js"


const router=express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/updateprofile", protectRoute, updateProfile);

router.get("/check",protectRoute,check)

export default router;
