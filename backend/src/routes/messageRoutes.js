import express from "express";
import { protectRoute } from "../middlewares/authMiddleware.js";

import {
  getSideUsers,
  getMessages,
  sendMessages,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/users", protectRoute, getSideUsers);

router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessages);

export default router;
