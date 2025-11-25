import express from "express";
import {
  createMessage,
  getAllMessages
} from "../controllers/messageController.js";

const router = express.Router();

// POST /api/messages - Create a new message
router.post("/", createMessage);

// GET /api/messages - Get all messages
router.get("/", getAllMessages);

export default router;