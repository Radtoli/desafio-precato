import express from "express";
import { updateMessageStatus, getMessagesByStatus } from "../controllers/messageController.js";
import { validateToken } from "../middleware/validateToken.js";

const router = express.Router();

router.put("/precato/:id/:status",validateToken, updateMessageStatus);
router.get("/precato/:status",validateToken, getMessagesByStatus);

export default router;
