import express from "express";
import {
  createMessage,
  getAllMessages,
  getAdminMessages
} from "../controllers/messageController.js";
import { authenticateUser, adminAuthorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/messages - Create a new message
router.post("/", createMessage);

// GET /api/messages - Get all messages
router.get("/", getAllMessages);

// GET /api/messages/admin - Admin get messages with filters and search
router.get("/admin", authenticateUser, adminAuthorize, getAdminMessages);

export default router;